import {MenuItem} from "@mui/material";
import * as React from "react";

interface ICVDEthnicityCoefficients {
  maori: number;
  pacific: number;
  indian: number;
  asian: number;
}

interface ICVDCoefficients {
  baseSurvival: number;
  ageMean: number;
  nzdMean: number;
  sbpMean: number;
  tcHdlMean: number;
  cAge: number;
  cEthnicity: ICVDEthnicityCoefficients;
  cNZDep: number;
  cExSmoker: number;
  cSmoker: number;
  cFamilyHist: number;
  cAF: number;
  cDiabetes: number;
  cSBP: number;
  cTcHdl: number;
  cOBPLM: number;
  cOLLM: number;
  cOATM: number;
  cAgeDiabetes: number;
  cAgeSBP: number;
  cObplmSBP: number;
}

const maleCoefficients: ICVDCoefficients = {
  baseSurvival: 0.974755526232,
  ageMean: 51.79953,
  nzdMean: 2.97293,
  sbpMean: 129.1095,
  tcHdlMean: 4.38906,
  cAge: 0.0675532,
  cEthnicity: {
    maori: 0.2899054,
    pacific: 0.1774195,
    indian: 0.2902049,
    asian: -0.3975687,
  },
  cNZDep: 0.0794903,
  cExSmoker: 0.0753246,
  cSmoker: 0.5058041,
  cFamilyHist: 0.1326587,
  cAF: 0.5880131,
  cDiabetes: 0.5597023,
  cSBP: 0.0163778,
  cTcHdl: 0.1283758,
  cOBPLM: 0.2947634,
  cOLLM: -0.0537314,
  cOATM: 0.0934141,
  cAgeDiabetes: -0.020235,
  cAgeSBP: -0.0004184,
  cObplmSBP: -0.0053077,
};

const femaleCoefficients: ICVDCoefficients = {
  baseSurvival: 0.983169213058,
  ageMean: 56.13665,
  nzdMean: 2.990826,
  sbpMean: 129.0173,
  tcHdlMean: 3.726268,
  cAge: 0.0756412,
  cEthnicity: {
    maori: 0.3910183,
    pacific: 0.2010224,
    indian: 0.1183427,
    asian: -0.28551,
  },
  cNZDep: 0.1080795,
  cExSmoker: 0.087476,
  cSmoker: 0.6226384,
  cFamilyHist: 0.0445534,
  cAF: 0.8927126,
  cDiabetes: 0.5447632,
  cSBP: 0.0136606,
  cTcHdl: 0.1226753,
  cOBPLM: 0.339925,
  cOLLM: -0.0593798,
  cOATM: 0.1172496,
  cAgeDiabetes: -0.0222549,
  cAgeSBP: -0.0004425,
  cObplmSBP: -0.004313,
};

export interface CVDRiskCalculatorParams {
  isMale?: boolean;
  age?: number;
  ethnicity?: string;
  tcHdl?: number | null;
  systolicBP?: number;
  nzDep?: number;
  exSmoker?: boolean;
  smoker?: boolean;
  familyHistory?: boolean;
  af?: boolean;
  diabetes?: boolean;
  obplm?: boolean;
  ollm?: boolean;
  oatm?: boolean;
};

export interface NewCVDRiskCalculatorParams {
  birthSex?: string | null;  // snomed code of birth sex
  age?: number | null;  // age in years
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


const NewCalculator = (
    {
      birthSex,
      age,
      ethnicity,
      totalCholesterol,
      hdl,
      systolicBP,
      nzDep,
      smoker,
      familyHistory,
      af,
      diabetes,
      obplm,
      ollm,
      oatm,
    } : NewCVDRiskCalculatorParams
) : number | null => {
  const coeff = "248153007" === birthSex ? maleCoefficients : "248152002" === birthSex ? femaleCoefficients : null;
  if ( coeff === null){
    return null;
  }

  const tcHdl = (totalCholesterol && hdl) ?  totalCholesterol / hdl : undefined;
  // use means to normalise values
  const tcHdlOffset = tcHdl !== undefined ? tcHdl - coeff.tcHdlMean : undefined;

  const ageOffset =
      age !== undefined && age !== null
          ? Math.max(age, 35.0) - coeff.ageMean
          : undefined;
  const nzDepOffset =
      nzDep !== undefined && nzDep !== null ? nzDep - coeff.nzdMean : undefined;
  const sbpOffset =
      systolicBP !== undefined && systolicBP !== null
          ? systolicBP - coeff.sbpMean
          : undefined;

  // work out the sum of coefiicients
  let sumOfCoeffs = 0.0;

  if (ageOffset !== undefined) {
    sumOfCoeffs += coeff.cAge * ageOffset;
  }
  if (nzDepOffset !== undefined) {
    sumOfCoeffs += coeff.cNZDep * nzDepOffset;
  }
  if (sbpOffset !== undefined) {
    sumOfCoeffs += coeff.cSBP * sbpOffset;
    if (ageOffset !== undefined) {
      sumOfCoeffs += coeff.cAgeSBP * ageOffset * sbpOffset;
    }
  }
  if (tcHdlOffset !== undefined) {
    sumOfCoeffs += coeff.cTcHdl * tcHdlOffset;
  }
  // can't be smoker and ex-smoker
  if ("77176002" === smoker) {
    sumOfCoeffs += coeff.cSmoker;
  } else if ("160617001" === smoker) {
    sumOfCoeffs += coeff.cExSmoker;
  }
  if (diabetes) {
    sumOfCoeffs += coeff.cDiabetes;
    if (ageOffset !== undefined) {
      sumOfCoeffs += coeff.cAgeDiabetes * ageOffset;
    }
  }
  if (obplm) {
    sumOfCoeffs += coeff.cOBPLM;
    if (sbpOffset !== undefined) {
      sumOfCoeffs += coeff.cObplmSBP * sbpOffset;
    }
  }
  if (ollm) {
    sumOfCoeffs += coeff.cOLLM;
  }
  if (oatm) {
    sumOfCoeffs += coeff.cOATM;
  }
  if (familyHistory) {
    sumOfCoeffs += coeff.cFamilyHist;
  }
  if (af) {
    sumOfCoeffs += coeff.cAF;
  }

  if (ethnicity && ethnicity in coeff.cEthnicity) {
    sumOfCoeffs +=
        coeff.cEthnicity[ethnicity as keyof ICVDEthnicityCoefficients];
  }
  return (1.0 - Math.pow(coeff.baseSurvival, Math.exp(sumOfCoeffs))) * 100.0;

}


const Calculator = (
  {
    isMale,
    age,
    ethnicity,
    tcHdl,
    systolicBP,
    nzDep,
    exSmoker,
    smoker,
    familyHistory,
    af,
    diabetes,
    obplm,
    ollm,
    oatm,
  }: CVDRiskCalculatorParams
): number => {
  const coeff = isMale ? maleCoefficients : femaleCoefficients;

  // use means to normalise values
  const tcHdlOffset =
    tcHdl !== undefined && tcHdl !== null ? tcHdl - coeff.tcHdlMean : undefined;

  const ageOffset =
    age !== undefined && age !== null
      ? Math.max(age, 35.0) - coeff.ageMean
      : undefined;
  const nzDepOffset =
    nzDep !== undefined && nzDep !== null ? nzDep - coeff.nzdMean : undefined;
  const sbpOffset =
    systolicBP !== undefined && systolicBP !== null
      ? systolicBP - coeff.sbpMean
      : undefined;

  // work out the sum of coefiicients
  let sumOfCoeffs = 0;

  if (ageOffset !== undefined) {
    sumOfCoeffs += coeff.cAge * ageOffset;
  }
  if (nzDepOffset !== undefined) {
    sumOfCoeffs += coeff.cNZDep * nzDepOffset;
  }
  if (sbpOffset !== undefined) {
    sumOfCoeffs += coeff.cSBP * sbpOffset;
    if (ageOffset !== undefined) {
      sumOfCoeffs += coeff.cAgeSBP * ageOffset * sbpOffset;
    }
  }
  if (tcHdlOffset !== undefined) {
    sumOfCoeffs += coeff.cTcHdl * tcHdlOffset;
  }
  // can't be smoker and ex-smoker
  if (smoker) {
    sumOfCoeffs += coeff.cSmoker;
  } else if (exSmoker) {
    sumOfCoeffs += coeff.cExSmoker;
  }
  if (diabetes) {
    sumOfCoeffs += coeff.cDiabetes;
    if (ageOffset !== undefined) {
      sumOfCoeffs += coeff.cAgeDiabetes * ageOffset;
    }
  }
  if (obplm) {
    sumOfCoeffs += coeff.cOBPLM;
    if (sbpOffset !== undefined) {
      sumOfCoeffs += coeff.cObplmSBP * sbpOffset;
    }
  }
  if (ollm) {
    sumOfCoeffs += coeff.cOLLM;
  }
  if (oatm) {
    sumOfCoeffs += coeff.cOATM;
  }
  if (familyHistory) {
    sumOfCoeffs += coeff.cFamilyHist;
  }
  if (af) {
    sumOfCoeffs += coeff.cAF;
  }

  if (ethnicity && ethnicity in coeff.cEthnicity) {
    sumOfCoeffs +=
      coeff.cEthnicity[ethnicity as keyof ICVDEthnicityCoefficients];
  }
  return (1.0 - Math.pow(coeff.baseSurvival, Math.exp(sumOfCoeffs))) * 100.0;
};

export default NewCalculator;
