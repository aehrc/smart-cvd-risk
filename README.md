## SMART CVD Risk Example App

See it in action at: https://aehrc.github.io/smart-cvd-risk/

Edit it on CodeSandbox: https://codesandbox.io/s/github/aehrc/smart-cvd-risk

This is a simple example of a CVD risk calculator that uses [FHIR](https://hl7.org/fhir) and the 
[Smart App Launch Framework](https://hl7.org/fhir/smart-app-launch/).

It is designed to be launched from a FHIR/SMART enabled application such as an EHR. It makes a 
series of requests to the FHIR endpoint to prefill the form with available patient data. Finally, 
the app can write a risk score observation back into the system, again using the FHIR endpoint.

It is written using [React](https://reactjs.org/) and [Material UI](https://mui.com/). You can run 
it locally using the following commands:

```
npm install
npm start
```

This is an example only, and should not be used for any sort of production purpose.

Copyright © 2021, Commonwealth Scientific and Industrial Research Organisation 
(CSIRO) ABN 41 687 119 230. Licensed under the 
[CSIRO Open Source Software Licence Agreement](./LICENSE.md).
