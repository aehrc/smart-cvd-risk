import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {Stack, TextField} from "@mui/material";
import {IPatient, PatientGenderKind} from "@ahryman40k/ts-fhir-types/lib/R4";
import moment from "moment";

interface Props {
  patient: IPatient;
}

export default function App(props: Props) {
  const {patient} = props,
  birthSexIsMale = patient.gender === PatientGenderKind._male,
  age = moment().diff(patient.birthDate, 'years');

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cardiovascular risk calculator
        </Typography>
        <FormControl fullWidth>
          <FormControlLabel label="Birth sex is male?" control={<Switch />} value={birthSexIsMale} />
        </FormControl>
        <FormControl fullWidth>
          <TextField label="Age in years" type="number" value={age}/>
        </FormControl>
      </Stack>
    </Container>
  );
}
