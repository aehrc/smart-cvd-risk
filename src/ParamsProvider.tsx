import Client from "fhirclient/lib/Client";
import { createContext, useMemo } from "react";
import {
  IBundle,
  IObservation,
  IPatient,
  PatientGenderKind,
} from "@ahryman40k/ts-fhir-types/lib/R4";
import moment from "moment";
import { NewCVDRiskCalculatorParams } from "./Calculator";

interface Props {
  client: Client;
  children: any;
}

interface SourceData {
  patient: IPatient;
  cholesterol: IObservation[];
}

export interface PrefilledParams extends NewCVDRiskCalculatorParams {
  birthSex?: string | null;
  age?: number | null; // age in years
  ethnicity?: string | null;
  totalCholesterol?: number | null;
  hdl?: number | null;
  systolicBP?: number | null;
  nzDep?: number | null;
  smoker?: string | null; // snomed code of smoking status
  familyHistory?: boolean;
  af?: boolean;
  diabetes?: boolean;
  obplm?: boolean;
  ollm?: boolean;
  oatm?: boolean;
}

const BIRTH_SEX_URL =
  "http://hl7.org.au/fhir/StructureDefinition/au-sexassignedatbirth";

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

const TOTAL_CHOLESTEROL_CODE = "14647-2";
const HDL_CODE = "14646-4";

async function getSourceData(client: Client): Promise<SourceData> {
  const patient = await client.patient.read();
  const cholesterolBundle = await client.request<IBundle>(
    `/Observation?_sort=-effectiveDateTime&patient=${patient.id}&_count=2&` +
      "code=http%3A%2F%2Floinc.org%7C" +
      TOTAL_CHOLESTEROL_CODE +
      ",http%3A%2F%2Floinc.org%7C" +
      HDL_CODE
  );
  return {
    patient: patient,
    cholesterol: cholesterolBundle.entry
      ? cholesterolBundle.entry
          .filter((entry) => entry.resource)
          .map((entry) => entry.resource as IObservation)
      : [],
  };
}

function extractParams(sourceData: SourceData) {
  let tcHdlData = tcHdl(sourceData.cholesterol);
  return {
    birthSex: birthSex(sourceData.patient),
    age: age(sourceData.patient),
    ...tcHdlData,
  };
}

function birthSex(patient: IPatient): string | null {
  if (!patient.extension) {
    return null;
  }
  const extensions = patient.extension.filter((e) => e.url === BIRTH_SEX_URL);
  let birthSex;
  if (extensions.length > 0) {
    birthSex = extensions[0].valueCode ?? null;
  }
  if (birthSex) {
    return birthSex;
  } else {
    if (!patient.gender) {
      return null;
    } else if (patient.gender === PatientGenderKind._female) {
      return "248152002";
    } else if (patient.gender === PatientGenderKind._male) {
      return "248153007";
    } else {
      return null;
    }
  }
}

function age(patient: IPatient): number {
  return moment().diff(patient.birthDate, "years");
}

function tcHdl(
  cholesterol: IObservation[]
): { hdl: number; totalCholesterol: number } | null {
  if (cholesterol.length !== 2) {
    return null;
  }
  const total = cholesterol[0],
    hdl = cholesterol[1];
  if (
    !total.effectiveDateTime ||
    !hdl.effectiveDateTime ||
    total.effectiveDateTime !== hdl.effectiveDateTime
  ) {
    return null;
  }
  const totalValue = total.valueQuantity?.value,
    totalUnits = total.valueQuantity?.unit,
    hdlValue = hdl.valueQuantity?.value,
    hdlUnits = hdl.valueQuantity?.unit;
  if (
    !totalValue ||
    !hdlValue ||
    !totalUnits ||
    !hdlUnits ||
    totalUnits !== hdlUnits
  ) {
    return null;
  }
  return { hdl: hdlValue, totalCholesterol: totalValue };
}
