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

  const schedules = await appointmentManager.getSchedules();
  console.log("Schedules:", schedules);

  for (const schedule of schedules) {
    console.log("Schedule:", JSON.stringify(schedule, null, 2));
  }
}
