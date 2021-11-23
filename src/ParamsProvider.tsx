import Client from "fhirclient/lib/Client";
import { createContext, useMemo } from "react";
import {
  IBundle,
  ICondition,
  IObservation,
  IPatient,
} from "@ahryman40k/ts-fhir-types/lib/R4";
import moment from "moment";
import { CVDRiskCalculatorParams } from "./Calculator";

interface Props {
  client: Client;
  children: any;
}

interface SourceData {
  patient: IPatient;
  observations: IObservation[];
  conditions: ICondition[];
}

export interface PrefilledParams extends CVDRiskCalculatorParams {
  birthSex?: string | null;
}

const BIRTH_SEX_URL =
  "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex";

export const CVDParamsContext = createContext<Promise<PrefilledParams> | null>(
  null
);

export default function ParamsProvider(props: Props) {
  const { client } = props,
    sourceData = useMemo(() => getSourceData(client), []),
    params = sourceData.then((data) => extractParams(data));

  return (
    <CVDParamsContext.Provider value={params}>
      {props.children}
    </CVDParamsContext.Provider>
  );
}

async function getSourceData(client: Client): Promise<SourceData> {
  const patient = await client.patient.read();
  const observationsBundle = await client.request<IBundle>(
    `Observation?patient=${patient.id}`
  );
  const withObservations = {
    patient: patient,
    observations: observationsBundle.entry
      ? observationsBundle.entry
          .filter((entry) => entry.resource)
          .map((entry) => entry.resource as IObservation)
      : [],
  };
  const conditionsBundle = await client.request<IBundle>(
    `Condition?patient=${patient.id}`
  );
  return {
    ...withObservations,
    conditions: conditionsBundle.entry
      ? conditionsBundle.entry
          .filter((entry) => entry.resource)
          .map((entry) => entry.resource as ICondition)
      : [],
  };
}

function extractParams(sourceData: SourceData) {
  return {
    birthSex: birthSex(sourceData.patient),
    age: age(sourceData.patient),
  };
}

function birthSex(patient: IPatient): string | null {
  if (!patient.extension) {
    return null;
  }
  const birthSexCode = patient.extension
    .filter((e) => e.url === BIRTH_SEX_URL)
    .map((e) => e.valueCode);
  if (birthSexCode.includes("M")) {
    return "248153007";
  } else if (birthSexCode.includes("F")) {
    return "248152002";
  } else {
    return null;
  }
}

function age(patient: IPatient): number {
  return moment().diff(patient.birthDate, "years");
}
