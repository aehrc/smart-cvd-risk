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
  iss: "https://www.demo.oridashi.com.au:8102",
  redirectUri: "test.html",
  clientId: "47059543-3654-466b-9c71-495957306af0",
  scope:
    "launch patient/*.read patient/Observation.write offline_access openid fhirUser",
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
