import * as React from 'react';
import {render} from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import {ThemeProvider} from '@mui/material/styles';
import App from './App';
import theme from './theme';
import {oauth2 as SMART} from "fhirclient";
import {IPatient} from "@ahryman40k/ts-fhir-types/lib/R4";

let rootElement = document.querySelector('#root');

SMART.init({
  redirectUri: "test.html",
  clientId: "whatever",
  scope: "launch/patient offline_access openid fhirUser",

  // WARNING: completeInTarget=true is needed to make this work in the codesandbox
  // frame. It is otherwise not needed if the target is not another frame or window
  // but since the entire example works in a frame here, it gets confused without
  // setting this!
  completeInTarget: true
})
.then((client) =>
    client.request<IPatient>(`/Patient/${client.patient.id}`)
)
.then(
    (patient) => {
      render(<ThemeProvider theme={theme}>
        <CssBaseline />
        <App patient={patient} />
      </ThemeProvider>, rootElement);
    },
    (error) => console.error(error)
);
