import { Practitioner } from "@medplum/fhirtypes";
import { getClient } from "./getClient";

export async function listPractitioners() {
  const medplum = getClient();

  return await medplum.searchResources("Practitioner", {});
}

export async function getPractitioner(
  id: string
): Promise<Practitioner & { id: string }> {
  const medplum = getClient();

  const practitioner = await medplum.readResource("Practitioner", id);
  if (!practitioner.id) {
    throw new Error("Practitioner not found");
  }

  return practitioner as Practitioner & { id: string };
}

export async function getCurrentPractitioner() {
  if (!process.env.PRACTITIONER_ID) {
    throw new Error("PRACTITIONER_ID not set");
  }

  return await getPractitioner(process.env.PRACTITIONER_ID);
}
