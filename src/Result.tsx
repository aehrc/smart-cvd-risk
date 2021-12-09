import { Button, Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Calculator, { CVDRiskCalculatorParams } from "./Calculator";
import { Save } from "@mui/icons-material";
import Client from "fhirclient/lib/Client";
import {
  IObservation,
  ObservationStatusKind,
} from "@ahryman40k/ts-fhir-types/lib/R4";

interface Props {
  params: CVDRiskCalculatorParams;
  client: Client;
}

export default function Result(props: Props) {
  const { params, client } = props,
    result = Calculator(params),
    formatted = result
      ? Intl.NumberFormat("en", {
          useGrouping: false,
          maximumFractionDigits: 1,
        }).format(result)
      : "";

  const handleRecord = () => {
    if (result === null) {
      return;
    }
    const observation: IObservation = {
      resourceType: "Observation",
      status: ObservationStatusKind._final,
      code: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "827181004",
            display: "Risk of cardiovascular disease",
          },
        ],
      },
      valueQuantity: {
        value: result,
        unit: "%",
      },
      subject: {
        reference: "Patient/" + client.patient.id,
      },
    };
    client.create(observation as any).catch((e) => console.error(e));
  };

  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          Calculated risk score
        </Typography>
        <Typography color="primary" sx={{ textAlign: "right" }}>
          {result ? `${formatted}%` : "(not enough information)"}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
        <Button variant="contained" startIcon={<Save />} onClick={handleRecord}>
          Record risk score
        </Button>
      </Stack>
    </Card>
  );
}
