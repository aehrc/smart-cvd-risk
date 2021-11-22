import * as React from "react";
import { render } from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import theme from "./theme";
import { oauth2 as SMART } from "fhirclient";
import { IPatient } from "@ahryman40k/ts-fhir-types/lib/R4";

let rootElement = document.querySelector("#root");

SMART.init({
  iss:
    "https://launch.smarthealthit.org/v/r3/sim/eyJoIjoiMSIsImIiOiJzbWFydC0xNjQyMDY4IiwiZSI6InNtYXJ0LVByYWN0aXRpb25lci03MTYxNDUwMiJ9/fhir",
  redirectUri: "test.html",
  clientId: "whatever",
  scope: "launch/patient offline_access openid fhirUser",
})
  .then((client) => client.request<IPatient>(`/Patient/${client.patient.id}`))
  .then(
    (patient) => {
      render(
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App patient={patient} />
        </ThemeProvider>,
        rootElement
      );
    },
    (error) => console.error(error)
  );
