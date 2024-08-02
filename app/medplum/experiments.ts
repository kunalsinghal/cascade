"use server";

import { getClient } from "./getClient";
import { getCurrentPractitioner, listPractitioners } from "./practitioners";
import { AppointmentManager } from "./AppointmentManager";

export async function trySomeMedplumThings() {
  const medplum = getClient();

  // read all pateints
  const patients = await medplum.searchResources("Patient", {});
  console.log("All patients:", patients);

  const practitioner = await getCurrentPractitioner();
  const appointmentManager = new AppointmentManager(practitioner.id);

  await appointmentManager.createFreshSlots();

  const slots = await appointmentManager.getAvailableSlots();

  console.log("Slots:", slots);
}
