"use server";

import { AppointmentManager } from "./AppointmentManager";

export async function getAvailableSlotsForDay(
  day: string,
  practitionerId: string
) {
  const date = new Date(day);
  const appointmentManager = new AppointmentManager(practitionerId);

  return await appointmentManager.getAvailableSlotsForDay(date);
}
