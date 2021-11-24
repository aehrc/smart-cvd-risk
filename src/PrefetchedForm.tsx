import { useContext } from "react";
import { CVDParamsContext } from "./ParamsProvider";
import Form from "./Form";
import usePromise from "react-promise-suspense";
import Client from "fhirclient/lib/Client";

interface Props {
  client: Client;
}

export default function PrefetchedForm(props: Props) {
  const { client } = props,
    PrefetchedCVDParams = useContext(CVDParamsContext),
    initialParams = usePromise(() => PrefetchedCVDParams, []);

  return <Form initialParams={initialParams} client={client} />;
}
