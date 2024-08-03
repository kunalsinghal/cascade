"use client";
import { useState } from "react";
import Image from "next/image";

export default function DermatologyPractice() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Appointment booked:", { name, email, date, doctor });
    setName("");
    setEmail("");
    setDate("");
    setDoctor("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">ClearSkin Dermatology</h1>
          <nav>
            <a href="#about" className="mx-2 hover:underline">
              About
            </a>
            <a href="#services" className="mx-2 hover:underline">
              Services
            </a>
            <a href="#book" className="mx-2 hover:underline">
              Book Appointment
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <section id="about" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to ClearSkin Dermatology
          </h2>
          <p className="text-lg mb-4">
            At ClearSkin Dermatology, we're committed to helping you achieve
            healthy, beautiful skin. Our team of expert dermatologists
            specializes in treating a wide range of skin conditions, from common
            concerns like acne and eczema to more complex dermatological issues.
          </p>
          <div className="flex justify-center">
            <Image
              src="/dermatology-clinic.jpg"
              alt="ClearSkin Dermatology Clinic"
              width={800}
              height={400}
              className="rounded-lg shadow-md"
            />
          </div>
        </section>
        <section id="services" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Acne Treatment</h3>
              <p>
                We offer customized acne treatments to help clear your skin and
                prevent future breakouts. Our approaches include topical
                medications, oral antibiotics, and advanced laser therapies.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Eczema Management</h3>
              <p>
                Our dermatologists provide comprehensive care for eczema,
                including identifying triggers, prescribing medications, and
                recommending skincare routines to soothe and heal your skin.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Skin Cancer Screening
              </h3>
              <p>
                Early detection is key in treating skin cancer. We offer
                thorough skin examinations and use advanced technology to
                identify and treat potentially cancerous lesions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">
                Cosmetic Dermatology
              </h3>
              <p>
                Enhance your natural beauty with our range of cosmetic
                treatments, including Botox, dermal fillers, chemical peels, and
                laser skin resurfacing.
              </p>
            </div>
          </div>
        </section>
        {/* Booking Section */}
        <section id="book" className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Book an Appointment</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
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
                <option value="dr-smith">Dr. Smith</option>
                <option value="dr-johnson">Dr. Johnson</option>
                <option value="dr-williams">Dr. Williams</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 ClearSkin Dermatology. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
