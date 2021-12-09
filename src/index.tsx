import * as React from "react";
import { render } from "react-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import PrefetchedForm from "./PrefetchedForm";
import theme from "./theme";
import { oauth2 as SMART } from "fhirclient";
import ParamsProvider from "./ParamsProvider";
import Prefetching from "./Prefetching";

let rootElement = document.querySelector("#root");

SMART.init({
  iss: process.env.REACT_APP_ISSUER ?? "https://www.demo.oridashi.com.au:8102",
  redirectUri: "index.html",
  clientId: process.env.REACT_APP_CLIENT_ID ?? "a2317248-5ee1-44f5-9098-73e1c5db4b32",
  scope: process.env.REACT_APP_SCOPE ?? "launch/patient patient/*.read patient/Observation.write offline_access openid fhirUser",
}).then(
  (client) => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ParamsProvider client={client}>
          <React.Suspense fallback={<Prefetching />}>
            <PrefetchedForm client={client} />
          </React.Suspense>
        </ParamsProvider>
      </ThemeProvider>,
      rootElement
    );
  },
  (error) => console.error(error)
);
