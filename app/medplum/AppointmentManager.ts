import {
  convertContainedResourcesToBundle,
  MedplumClient,
} from "@medplum/core";
import { getClient } from "./getClient";
import { Schedule, Slot } from "@medplum/fhirtypes";

export class AppointmentManager {
  private readonly _client: MedplumClient;

  constructor(private readonly _practitionerId: string) {
    this._client = getClient();
  }

  async getSchedules(): Promise<Schedule[]> {
    return await this._client.searchResources("Schedule", {
      actor: `Practitioner/${this._practitionerId}`,
    });
  }

  async getSchedule(): Promise<Schedule & { id: string }> {
    const schedules = await this.getSchedules();
    if (schedules.length === 0) {
      throw new Error("No schedules found");
    }

    // assuming a single schedule for now
    return schedules[0] as Schedule & { id: string };
  }

  async getAvailableSlots() {
    const schedule = await this.getSchedule();

    const slots = await this._client.searchResources("Slot", {
      schedule: `Schedule/${schedule.id}`,
      status: "free",
    });

    return slots;
  }

  async getAvailableSlotsForDay(day: Date) {
    const schedule = await this.getSchedule();

    day.setUTCHours(0, 0, 0, 0);

    const slots = await this._client.searchResources("Slot", {
      schedule: `Schedule/${schedule.id}`,
      start: `ge${day.toISOString()}`,
      status: "free",
      _count: 1000,
    });

    return (
      slots
        .filter((slot) => {
          const slotStart = new Date(slot.start);
          if (slotStart.getUTCDate() !== day.getUTCDate()) {
            return false;
          }
          if (slotStart.getUTCFullYear() !== day.getUTCFullYear()) {
            return false;
          }
          if (slotStart.getUTCMonth() !== day.getUTCMonth()) {
            return false;
          }

          return true;
        })
        // sort by start time
        .sort((a, b) => {
          return a.start.localeCompare(b.start);
        })
    );
  }

  async bookSlot(slotId: string, patientId: string) {
    const slot = await this._client.readResource("Slot", slotId);

    if (slot.status !== "free") {
      throw new Error("Slot is not available");
    }

    // create an appointment
    await this._client.createResource({
      resourceType: "Appointment",
      slot: [{ reference: `Slot/${slot.id}` }],
      status: "booked",
      start: slot.start,
      end: slot.end,
      participant: [
        {
          actor: { reference: `Patient/${patientId}` },
          status: "accepted",
        },
        {
          actor: { reference: `Practitioner/${this._practitionerId}` },
          status: "accepted",
        },
      ],
    });

    slot.status = "busy";

    await this._client.updateResource(slot);
  }

  async resetSlots() {
    const schedule = await this.getSchedule();

    const start = schedule.planningHorizon?.start || new Date().toUTCString();
    // end of the year as default
    const end =
      schedule.planningHorizon?.end ||
      new Date(new Date().getFullYear(), 11, 31).toISOString();

    const startDate = new Date(start);
    startDate.setUTCHours(0, 0, 0, 0);

    // iterate over the days and create slots
    const slots: Slot[] = [];
    for (
      let d = startDate;
      d.toISOString() <= end;
      d.setDate(d.getDate() + 1)
    ) {
      console.log("Creating slots for", d);
      // skip weekends
      if (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
        continue;
      }

      // create slots every 15 minutes from 10 am to 4 pm

      for (let h = 10; h < 16; h++) {
        for (let m = 0; m < 60; m += 15) {
          const start = new Date(d);
          start.setUTCHours(h, m, 0, 0);

          const end = new Date(start);
          end.setUTCMinutes(end.getUTCMinutes() + 15);

          slots.push({
            resourceType: "Slot",
            schedule: {
              reference: `Schedule/${schedule.id}`,
            },
            status: "free",
            start: start.toISOString(),
            end: end.toISOString(),
          });
        }
      }
    }

    console.log("Creating slots:", slots);

    // delete all existing slots
    const existingSlots = await this._client.searchResources("Slot", {
      schedule: `Schedule/${schedule.id}`,
      _count: 10000,
    });

    if (existingSlots.length > 0) {
      await Promise.all(
        existingSlots.map((slot) =>
          this._client.deleteResource("Slot", `Slot/${slot.id}`)
        )
      );
    }

    // create all slots in parallel
    await Promise.all(slots.map((slot) => this._client.createResource(slot)));
  }
}
