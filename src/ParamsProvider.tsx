import Client from "fhirclient/lib/Client";
import { createContext, useMemo } from "react";
import {
  IBundle,
  ICondition,
  IFamilyMemberHistory,
  IObservation,
  IPatient,
  PatientGenderKind,
} from "@ahryman40k/ts-fhir-types/lib/R4";
import moment from "moment";
import { NewCVDRiskCalculatorParams } from "./Calculator";
import TerminologyClient from "./TxClient";

interface Props {
  client: Client;
  children: any;
}

interface SourceData {
  patient: IPatient;
  cholesterol: IObservation[];
  bloodPressure: IObservation[];
  history: ICondition[];
  familyHistory: IFamilyMemberHistory[];
  smoker: IObservation[];
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

const TX_ENDPOINT = "https://r4.ontoserver.csiro.au/fhir";

const SNOMED_URI = "http://snomed.info/sct";
const TOTAL_CHOLESTEROL_LOINC_CODE = "14647-2";
const HDL_LOINC_CODE = "14646-4";
const DIABETES_VALUE_SET_URI =
  "http://snomed.info/sct?fhir_vs=ecl/%3C%3C%2073211009%20";
const CARDIOVASCULAR_VALUE_SET_URI =
  "http://snomed.info/sct?fhir_vs=ecl/%3C%3C%2049601007%20";
const AF_VALUE_SET_URI =
  "http://snomed.info/sct?fhir_vs=ecl/%3C%3C%2049436004%20";

const BLOOD_PRESSURE_CODINGS = [
  {
    system: SNOMED_URI,
    code: "163035008",
  },
  {
    system: "http://loinc.org",
    code: "55284-4",
  },
  {
    system: "http://loinc.org",
    code: "85354-9",
  },
];

const SMOKER_CODINGS = [
  {
    system: "http://loinc.org",
    code: "72166-2",
  },
];
const NON_SMOKER_CODES = ["8392000", "LA18978-9"];
const STOPPED_SMOKING_CODES = ["160617001", "8517006", "LA15920-4"];
const CURRENT_SMOKER_CODES = [
  "77176002",
  "LA18976-3",
  "LA18977-1",
  "LA18981-3",
  "LA18982-1",
];

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
  const patient = await getPatient(client);
  return {
    patient: patient,
    cholesterol: await getCholesterol(client, patient),
    bloodPressure: await getBloodPressure(client, patient),
    history: await getHistory(client, patient),
    familyHistory: await getFamilyHistory(client, patient),
    smoker: await getSmoker(client, patient),
  };
}

async function getPatient(client: Client): Promise<IPatient> {
  return await client.patient.read();
}

async function getCholesterol(
  client: Client,
  patient: IPatient
): Promise<IObservation[]> {
  const bundle = await client.request<IBundle>(
    `/Observation?_sort=-effectiveDateTime&patient=${patient.id}&_count=2&` +
      "code=http%3A%2F%2Floinc.org%7C" +
      TOTAL_CHOLESTEROL_LOINC_CODE +
      ",http%3A%2F%2Floinc.org%7C" +
      HDL_LOINC_CODE
  );
  return bundle.entry
    ? bundle.entry
        .filter((entry) => entry.resource)
        .map((entry) => entry.resource as IObservation)
    : [];
}

async function getBloodPressure(
  client: Client,
  patient: IPatient
): Promise<IObservation[]> {
  const codeCondition = BLOOD_PRESSURE_CODINGS.map(
      (coding) => `${coding.system}|${coding.code}`
    ).join(","),
    bundle = await client.request<IBundle>(
      `/Observation?_sort=-effectiveDateTime&patient=${patient.id}&_count=1&code=` +
        codeCondition
    );
  return bundle.entry
    ? bundle.entry
        .filter((entry) => entry.resource)
        .map((entry) => entry.resource as IObservation)
    : [];
}

async function getHistory(
  client: Client,
  patient: IPatient
): Promise<ICondition[]> {
  const bundle = await client.request<IBundle>(
    `/Condition?patient=${patient.id}`
  );
  return bundle.entry
    ? bundle.entry
        .filter((entry) => entry.resource)
        .map((entry) => entry.resource as ICondition)
    : [];
}

async function getFamilyHistory(
  client: Client,
  patient: IPatient
): Promise<IFamilyMemberHistory[]> {
  const bundle = await client.request<IBundle>(
    `/FamilyMemberHistory?patient=${patient.id}`
  );
  return bundle.entry
    ? bundle.entry
        .filter((entry) => entry.resource)
        .map((entry) => entry.resource as IFamilyMemberHistory)
    : [];
}

async function getSmoker(
  client: Client,
  patient: IPatient
): Promise<IObservation[]> {
  const codeCondition = SMOKER_CODINGS.map(
      (coding) => `${coding.system}|${coding.code}`
    ).join(","),
    bundle = await client.request<IBundle>(
      `/Observation?_sort=-effectiveDateTime&patient=${patient.id}&_count=1&code=` +
        codeCondition
    );
  return bundle.entry
    ? bundle.entry
        .filter((entry) => entry.resource)
        .map((entry) => entry.resource as IObservation)
    : [];
}

async function extractParams(sourceData: SourceData): Promise<PrefilledParams> {
  let tcHdlData = tcHdl(sourceData.cholesterol);
  return {
    birthSex: birthSex(sourceData.patient),
    age: age(sourceData.patient),
    ...tcHdlData,
    systolicBP: systolicBP(sourceData.bloodPressure),
    diabetes: await diabetes(sourceData.history),
    familyHistory: await historyInValueSet(
      sourceData.familyHistory,
      CARDIOVASCULAR_VALUE_SET_URI
    ),
    af: await historyInValueSet(sourceData.familyHistory, AF_VALUE_SET_URI),
    smoker: smoker(sourceData.smoker),
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

function systolicBP(bloodPressure: IObservation[]): number | null {
  if (bloodPressure.length !== 1) {
    return null;
  }
  const bpObservation = bloodPressure[0],
    systolicComponent = bpObservation.component?.find((component) => {
      const coding = component.code?.coding;
      if (!coding) {
        return false;
      }
      const validCoding = coding.find(
        (c) =>
          (c.system === "http://loinc.org" && c.code === "8459-0") ||
          (c.system === "http://loinc.org" && c.code === "8480-6")
      );
      const correctUnit = component.valueQuantity?.unit === "mmHg";
      return validCoding && correctUnit;
    });
  return systolicComponent?.valueQuantity?.value ?? null;
}

async function diabetes(history: ICondition[]): Promise<boolean> {
  const txClient = new TerminologyClient(TX_ENDPOINT),
    diabetesCodings = await txClient.expandValueSet(DIABETES_VALUE_SET_URI);

  return history.some((condition) => {
    const coding = condition.code?.coding;
    if (!coding) {
      return false;
    }
    return !!coding.find((c) =>
      diabetesCodings.find((dc) => dc.system === c.system && dc.code === c.code)
    );
  });
}

async function historyInValueSet(
  familyHistory: IFamilyMemberHistory[],
  valueSetUri: string
): Promise<boolean> {
  const txClient = new TerminologyClient(TX_ENDPOINT),
    validCodings = await txClient.expandValueSet(valueSetUri);

  return familyHistory.some((familyHistory) => {
    const conditions = familyHistory.condition;
    if (!conditions) {
      return false;
    }
    return !!conditions.find((condition) => {
      if (!condition.code.coding) {
        return false;
      }
      return condition.code.coding.find((conditionCoding) =>
        validCodings.find(
          (c) =>
            c.system === conditionCoding.system &&
            c.code === conditionCoding.code
        )
      );
    });
  });
}

function smoker(smokerStatus: IObservation[]): string | null {
  if (smokerStatus.length !== 1) {
    return null;
  }
  const smokerObservation = smokerStatus[0];

  const coding = smokerObservation.valueCodeableConcept?.coding?.find(
    (c) =>
      (c.system === "http://loinc.org" ||
        c.system === "http://snomed.info/sct") &&
      c.code
  );
  const code = coding?.code ?? "";

  if (NON_SMOKER_CODES.includes(code)) {
    return "8392000";
  }
  if (STOPPED_SMOKING_CODES.includes(code)) {
    return "160617001";
  }
  if (CURRENT_SMOKER_CODES.includes(code)) {
    return "77176002";
  }
  return null;
}
