"use server";

import { getClient } from "./getClient";
import { listPractitioners } from "./listPractitioners";
import { AppointmentManager } from "./AppointmentManager";

export async function trySomeMedplumThings() {
  const medplum = getClient();

  // read all pateints
  const patients = await medplum.searchResources("Patient", {});

  console.log("All patients:", patients);

  const practitioners = await listPractitioners();

  if (practitioners.length === 0) {
    console.log("No practitioners found");
    return;
  }

  const practitioner = practitioners[0];
  if (!practitioner.id) {
    console.log("Practitioner has no ID");
    return;
  }

  const appointmentManager = new AppointmentManager(practitioner.id);

  const schedules = await appointmentManager.getSchedules();
  console.log("Schedules:", schedules);

  for (const schedule of schedules) {
    console.log("Schedule:", JSON.stringify(schedule, null, 2));
  }
}
