import { getClient } from "./getClient";

export async function listPractitioners() {
  const medplum = getClient();

  const practitioners = await medplum.searchResources("Practitioner", {});

  return practitioners;
}
