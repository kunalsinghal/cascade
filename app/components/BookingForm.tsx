"use client";
import { useEffect, useState } from "react";
import { listPractitioners } from "../medplum/practitioners";
import { Practitioner, Slot } from "@medplum/fhirtypes";
import { getAvailableSlotsForDay } from "../medplum/getSlots";
import { bookAppointment } from "../medplum/bookAppointment";

function validate(date: string): boolean {
  const now = new Date();
  const selected = new Date(date);
  return selected >= now;
}

function validateForm(
  name: string,
  email: string,
  date: string,
  doctor: string,
  selectedSlot: string
): boolean {
  // email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  return (
    name !== "" &&
    email !== "" &&
    date !== "" &&
    doctor !== "" &&
    selectedSlot !== ""
  );
}

export default function BookingForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");

  const [doctorsList, setDoctorsList] = useState<Practitioner[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [slotStatus, setSlotStatus] = useState<"searching" | "found" | "unset">(
    "unset"
  );

  useEffect(() => {
    // fetch doctors list
    listPractitioners().then((practitioners) => {
      console.log("Doctors list:", practitioners);
      setDoctorsList(practitioners);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (doctor !== "" && validate(date)) {
          setSlotStatus("searching");
          const slots = await getAvailableSlotsForDay(date, doctor);
          setSlots(slots);
          setSlotStatus("found");
        } else {
          setSlots([]);
          setSlotStatus("unset");
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlots([]);
        setSlotStatus("unset");
      }
    })();
  }, [date, doctor]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Appointment booked:", { name, email, date, doctor });

    bookAppointment(selectedSlot?.id ?? "", doctor, name, email).then(() => {
      alert("Appointment booked successfully!");
    });

    setName("");
    setEmail("");
    setDate("");
    setDoctor("");
    setSlots([]);
    setSlotStatus("unset");
    setSelectedSlot(null);
  };

  const bookingButtonDisabled = !validateForm(
    name,
    email,
    date,
    doctor,
    selectedSlot?.id ?? ""
  );

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="doctor"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Select Doctor:
        </label>
        <select
          id="doctor"
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select a doctor</option>
          {doctorsList.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name
                ?.map((name) => name.given?.join(" ") + ` ${name.family}`)
                .join(" ")}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label
          htmlFor="date"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Preferred Date:
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      {/* Radio buttons to select slot */}
      {slotStatus === "searching" && (
        <div className="mb-6">Searching for available slots...</div>
      )}
      {slotStatus === "found" && !slots.length && (
        <div className="mb-6">No slots available for the selected date</div>
      )}
      {slotStatus === "found" && slots.length && (
        <div className="mb-6">
          <label
            htmlFor="slot"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Select Slot (15 mins):
          </label>
          {slots.map((slot) => (
            <label key={slot.id} className="block p-1">
              <input
                type="radio"
                name="slot"
                value={slot.id}
                onChange={() => setSelectedSlot(slot)}
              />
              <span className="ml-2">
                {new Date(slot.start).toLocaleTimeString()}
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={bookingButtonDisabled}
        >
          Book Appointment
        </button>
      </div>
    </form>
  );
}
