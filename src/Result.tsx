import { Card, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import NewCalculator, {NewCVDRiskCalculatorParams} from "./Calculator";

interface Props {
  params: NewCVDRiskCalculatorParams;
}

export default function Result(props: Props) {
  const result = NewCalculator(props.params),
    formatted = result
      ? Intl.NumberFormat("en", {
          useGrouping: false,
          maximumFractionDigits: 1,
        }).format(result)
      : "";

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
    </Card>
  );
}
