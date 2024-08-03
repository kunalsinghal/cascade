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

  // find slots for Aug 5th, 2024
  const slots = await appointmentManager.getAvailableSlotsForDay(
    new Date("2024-08-05")
  );

  console.log("Slots:", slots);
  console.log("Slots count:", slots.length);
}
