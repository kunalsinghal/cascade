"use server";

import { Patient } from "@medplum/fhirtypes";
import { AppointmentManager } from "./AppointmentManager";
import { getClient } from "./getClient";

export async function bookAppointment(
  slotId: string,
  practitionerId: string,
  name: string,
  email: string
) {
  // create a new patient
  const medplum = getClient();

  const patient = (await medplum.createResource({
    resourceType: "Patient",
    name: [{ text: name }],
    telecom: [{ system: "email", value: email }],
  })) as Patient;

  if (!patient.id) {
    throw new Error("Failed to create patient");
  }

  // create a new appointment
  const appointmentManager = new AppointmentManager(practitionerId);

  await appointmentManager.bookSlot(slotId, patient.id);
}
