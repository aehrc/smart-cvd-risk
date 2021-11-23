import * as React from "react";
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import { PrefilledParams } from "./ParamsProvider";
import Result from "./Result";

interface Props {
  initialParams?: PrefilledParams;
}

export default function Form(props: Props) {
  const { initialParams } = props,
    [birthSex, setBirthSex] = useState(initialParams?.birthSex),
    [age, setAge] = useState(initialParams?.age ?? undefined),
    [totalCholesterol, setTotalCholesterol] = useState(
      initialParams?.totalCholesterol ?? undefined
    ),
    [hdl, setHdl] = useState(initialParams?.hdl ?? undefined),
    [systolicBP, setSystolicBP] = useState(
      initialParams?.systolicBP ?? undefined
    ),
    [nzDep, setNzDep] = useState(initialParams?.nzDep ?? undefined),
    [ethnicity, setEthnicity] = useState(initialParams?.ethnicity ?? undefined),
    [smoker, setSmoker] = useState(initialParams?.smoker ?? undefined),
    [familyHistory, setFamilyHistory] = useState(
      initialParams?.familyHistory ?? undefined
    ),
    [af, setAf] = useState(initialParams?.af ?? undefined),
    [diabetes, setDiabetes] = useState(initialParams?.diabetes ?? undefined),
    [obplm, setObplm] = useState(initialParams?.obplm ?? undefined),
    [ollm, setOllm] = useState(initialParams?.ollm ?? undefined),
    [oatm, setOatm] = useState(initialParams?.oatm ?? undefined);

  // const buildParams = (): CVDRiskCalculatorParams => {
  //   return {
  //     birthSex,
  //     age,
  //   };
  // };

  return (
    <Container component="form" maxWidth="sm">
      <Stack spacing={4} sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cardiovascular risk calculator
        </Typography>
        <FormControl fullWidth>
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
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Age in years"
            type="number"
            value={age}
            required
            onChange={(e) => setAge(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="ethnicity">Ethnicity</InputLabel>
          <Select
            label="ethnicity"
            required
            value={ethnicity}
            onChange={(e) => setEthnicity(e.target.value)}
          >
            <MenuItem value="european">European</MenuItem>
            <MenuItem value="maori">Maori</MenuItem>
            <MenuItem value="pacific">Pacific</MenuItem>
            <MenuItem value="indian">Indian</MenuItem>
            <MenuItem value="asian">Asian</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="HDL (mmol/L)"
            type="number"
            required
            inputProps={{ min: 0 }}
            value={hdl}
            onChange={(e) => setHdl(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Total cholesterol (mmol/L)"
            type="number"
            required
            inputProps={{ min: 0 }}
            value={totalCholesterol}
            onChange={(e) => setTotalCholesterol(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Systolic blood pressure (mm Hg)"
            type="number"
            required
            inputProps={{ min: 0, max: 250 }}
            value={systolicBP}
            onChange={(e) => setSystolicBP(parseInt(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="New Zealand Index of Socioeconomic Deprivation score"
            type="number"
            required
            inputProps={{ min: 0, max: 6 }}
            value={nzDep}
            onChange={(e) => setNzDep(parseFloat(e.target.value))}
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="smoking">Smoking status</InputLabel>
          <Select
            label="smoking"
            required
            value={smoker}
            onChange={(e) => setSmoker(e.target.value)}
          >
            <MenuItem value="8392000">Non-smoker</MenuItem>
            <MenuItem value="160617001">Stopped smoking</MenuItem>
            <MenuItem value="77176002">Current smoker</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="Diabetes"
            control={
              <Switch
                checked={diabetes}
                onChange={(e) => setDiabetes(e.target.checked)}
              />
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="Family history of cardiovascular disease?"
            control={
              <Switch
                checked={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.checked)}
              />
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="History of atrial fibrillation?"
            control={
              <Switch checked={af} onChange={(e) => setAf(e.target.checked)} />
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel label="History of diabetes?" control={<Switch />} />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="Currently taking blood pressure lowering medication?"
            control={
              <Switch
                checked={obplm}
                onChange={(e) => setObplm(e.target.checked)}
              />
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="Currently taking lipid lowering medication?"
            control={
              <Switch
                checked={ollm}
                onChange={(e) => setOllm(e.target.checked)}
              />
            }
          />
        </FormControl>
        <FormControl fullWidth>
          <FormControlLabel
            label="Currently taking anti-thrombotic medication?"
            control={
              <Switch
                checked={oatm}
                onChange={(e) => setOatm(e.target.checked)}
              />
            }
          />
        </FormControl>
        {
          <Result
            params={{
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
            }}
          />
        }
      </Stack>
    </Container>
  );
}
