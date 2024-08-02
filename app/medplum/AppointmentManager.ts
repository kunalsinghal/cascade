import { MedplumClient } from "@medplum/core";
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
    });

    return slots;
  }

  async createFreshSlots() {
    const schedule = await this.getSchedule();

    const start = schedule.planningHorizon?.start || new Date().toISOString();
    // end of the year as default
    const end =
      schedule.planningHorizon?.end ||
      new Date(new Date().getFullYear(), 11, 31).toISOString();

    console.log("Creating slots from", start, "to", end);

    // iterate over the days and create slots
    const slots: Slot[] = [];
    for (
      let d = new Date(start);
      d.toISOString() <= end;
      d.setDate(d.getDate() + 1)
    ) {
      console.log("Creating slots for", d);
      // skip weekends
      if (d.getDay() === 0 || d.getDay() === 6) {
        continue;
      }

      // create slots every 15 minutes from 10 am to 4 pm

      for (let h = 10; h < 16; h++) {
        for (let m = 0; m < 60; m += 15) {
          const start = new Date(d);
          start.setHours(h, m, 0, 0);

          const end = new Date(start);
          end.setMinutes(end.getMinutes() + 15);

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

    // create all slots in parallel
    await Promise.all(slots.map((slot) => this._client.createResource(slot)));
  }
}
