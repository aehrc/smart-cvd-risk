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

  async snomedIsA(conceptId: string): Promise<ICoding[]> {
    const response = await this.client.get<IValueSet>(
      `/ValueSet/$expand?url=http://snomed.info/sct?fhir_vs=ecl/%3C%3C%20${conceptId}%20`
    );
    return response.data.expansion?.contains ?? [];
  }
}
