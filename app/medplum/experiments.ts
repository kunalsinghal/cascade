"use server";

import { getClient } from "./getClient";
import { getCurrentPractitioner, listPractitioners } from "./practitioners";
import { AppointmentManager } from "./AppointmentManager";

export async function trySomeMedplumThings() {
  console.log("Trying some Medplum things", await listPractitioners());
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

  const slot = slots[0];
  if (!slot.id) {
    console.log("No slots found");
    return;
  }

  const patientId = patients[0].id;
  if (!patientId) {
    console.log("No patients found");
    return;
  }

  appointmentManager.bookSlot(slot.id, patientId);

  console.log("Slot booked");
}
