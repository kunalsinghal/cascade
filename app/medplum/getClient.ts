import { MedplumClient } from "@medplum/core";

let medplum: MedplumClient | null = null;

export function getClient(): MedplumClient {
  if (!medplum) {
    medplum = new MedplumClient({
      clientId: process.env.MEDPLUM_CLIENT_ID,
      clientSecret: process.env.MEDPLUM_CLIENT_SECRET,
    });
  }
  return medplum;
}
