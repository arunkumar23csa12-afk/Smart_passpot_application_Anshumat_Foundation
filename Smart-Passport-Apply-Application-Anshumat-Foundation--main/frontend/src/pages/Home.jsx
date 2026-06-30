import React from 'react';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServiceCard from "../components/ServiceCard";
import StepCard from "../components/StepCard";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />

      <div className="bg-gray-100 px-10 py-14">
        <h2 className="text-2xl font-bold text-blue-900">Quick Services</h2>
        <p className="text-gray-600 mb-6">Select a service to begin your journey.</p>
        <div className="grid md:grid-cols-3 gap-6">
          <ServiceCard title="New Application" desc="Start a fresh passport request" />
          <ServiceCard title="Track Status" desc="Check real-time progress" />
          <ServiceCard title="Help Center" desc="FAQs and support" />
        </div>
      </div>

      <div className="bg-gray-100 px-10 py-14 text-center">
        <h2 className="text-2xl font-bold text-blue-900">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <StepCard num="01" title="Fill Form" />
          <StepCard num="02" title="Upload Docs" />
          <StepCard num="03" title="Book Slot" />
          <StepCard num="04" title="Done" highlight />
        </div>
      </div>
    </div>
  );
}
