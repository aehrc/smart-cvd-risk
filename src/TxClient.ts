import { ICoding, IValueSet } from "@ahryman40k/ts-fhir-types/lib/R4";
import axios, { AxiosInstance } from "axios";

export default class TerminologyClient {
  readonly client: AxiosInstance;

  constructor(endpoint: string) {
    this.client = axios.create({
      baseURL: endpoint,
      headers: {
        Accept: "application/fhir+json",
      },
    });
  }

  async expandValueSet(url: string): Promise<ICoding[]> {
    const response = await this.client.get<IValueSet>(
      `/ValueSet/$expand?url=${url}`
    );
    return response.data.expansion?.contains ?? [];
  }
}
