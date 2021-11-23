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
  redirectUri: "test.html",
  clientId: "whatever",
  scope: "launch/patient offline_access openid fhirUser",
}).then(
  (client) => {
    render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ParamsProvider client={client}>
          <React.Suspense fallback={<Prefetching />}>
            <PrefetchedForm />
          </React.Suspense>
        </ParamsProvider>
      </ThemeProvider>,
      rootElement
    );
  },
  (error) => console.error(error)
);
