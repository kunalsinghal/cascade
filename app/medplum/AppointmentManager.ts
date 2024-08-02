import { MedplumClient } from "@medplum/core";
import { getClient } from "./getClient";
import { Schedule } from "@medplum/fhirtypes";

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
}
