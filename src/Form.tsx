import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {
  Card,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { CVDRiskCalculatorParams } from "./Calculator";
import { useState } from "react";
import { PrefilledParams } from "./ParamsProvider";

interface Props {
  initialParams?: PrefilledParams;
}

export default function Form(props: Props) {
  const { initialParams } = props,
    [birthSex, setBirthSex] = useState(initialParams?.birthSex),
    [age, setAge] = useState(initialParams?.age ?? undefined);

  const FormField = (props: { children: any }) => (
    <FormControl fullWidth>{props.children}</FormControl>
  );

  return (
    <Container maxWidth="sm">
      <Stack spacing={4} sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cardiovascular risk calculator
        </Typography>
        <FormField>
          <InputLabel id="birth-sex">Biological sex at birth</InputLabel>
          <Select
            label="birth-sex"
            required
            value={birthSex}
            onChange={(e) => setBirthSex(e.target.value)}
          >
            <MenuItem value="248152002">Female</MenuItem>
            <MenuItem value="248153007">Male</MenuItem>
            <MenuItem value="32570691000036108">Intersex</MenuItem>
            <MenuItem value="32570681000036106">Indeterminate sex</MenuItem>
          </Select>
        </FormField>
        <FormField>
          <TextField
            label="Age in years"
            type="number"
            value={age}
            required
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </FormField>
        <FormField>
          <InputLabel id="ethnicity">Ethnicity</InputLabel>
          <Select label="ethnicity" required>
            <MenuItem value="european">European</MenuItem>
            <MenuItem value="maori">Maori</MenuItem>
            <MenuItem value="pacific">Pacific</MenuItem>
            <MenuItem value="indian">Indian</MenuItem>
            <MenuItem value="asian">Asian</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormField>
        <FormField>
          <TextField
            label="Ratio of total cholesterol / HDL"
            type="number"
            required
            inputProps={{ min: 0, max: 1, step: 0.1 }}
          />
        </FormField>
        <FormField>
          <TextField
            label="Systolic blood pressure (mm Hg)"
            type="number"
            required
            inputProps={{ min: 0 }}
          />
        </FormField>
        <FormField>
          <TextField
            label="New Zealand Index of Socioeconomic Deprivation score"
            type="number"
            required
            inputProps={{ min: 0, max: 10 }}
          />
        </FormField>
        <FormField>
          <InputLabel id="smoking">Smoking status</InputLabel>
          <Select label="smoking" required>
            <MenuItem value="8392000">Non-smoker</MenuItem>
            <MenuItem value="160617001">Stopped smoking</MenuItem>
            <MenuItem value="77176002">Current smoker</MenuItem>
          </Select>
        </FormField>
        <FormField>
          <FormControlLabel
            label="Family history of cardiovascular disease?"
            control={<Switch />}
          />
        </FormField>
        <FormField>
          <FormControlLabel
            label="History of atrial fibrillation?"
            control={<Switch />}
          />
        </FormField>
        <FormField>
          <FormControlLabel label="History of diabetes?" control={<Switch />} />
        </FormField>
        <FormField>
          <FormControlLabel
            label="Currently taking blood pressure lowering medication?"
            control={<Switch />}
          />
        </FormField>
        <FormField>
          <FormControlLabel
            label="Currently taking lipid lowering medication?"
            control={<Switch />}
          />
        </FormField>
        <FormField>
          <FormControlLabel
            label="Currently taking anti-thrombotic medication?"
            control={<Switch />}
          />
        </FormField>
        <Card variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center">
            <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
              Calculated risk score
            </Typography>
            <Typography color="primary" sx={{ textAlign: "right" }}>
              (not enough information)
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
