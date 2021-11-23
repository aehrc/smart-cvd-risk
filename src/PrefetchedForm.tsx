import { useContext } from "react";
import { CVDParamsContext } from "./ParamsProvider";
import Form from "./Form";
import usePromise from "react-promise-suspense";

export default function PrefetchedForm() {
  const PrefetchedCVDParams = useContext(CVDParamsContext),
    initialParams = usePromise(() => PrefetchedCVDParams, []);

  return <Form initialParams={initialParams} />;
}
