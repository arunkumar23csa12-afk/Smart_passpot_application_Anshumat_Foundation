import React from 'react';
import Feature from "../components/Feature";
import Doc from "../components/Doc";
import { useNavigate } from "react-router-dom";

export default function NewApplication() {
  const nav = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen px-10 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="bg-green-200 text-black px-3 py-1 text-xs rounded">NEW APPLICATION</span>
          <h1 className="text-5xl font-bold mt-4 text-blue-700">Apply Passport <br/> in Minutes</h1>
          <p className="text-gray-400 mt-4 max-w-md">Skip queues and paperwork.</p>
          <div className="flex gap-4 mt-6">
            <Feature title="Fast Track" desc="10-15 mins" />
            <Feature title="Ready Up" desc="Keep docs ready" />
            <Feature title="Auto-Save" desc="Save anytime" />
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => nav("/form")} className="bg-blue-800 px-6 py-3 rounded-lg">
              Start Application →
            </button>
          </div>
        </div>
        <div>
          <img src="/passport.png" className="rounded-xl" />
        </div>
      </div>
      <div className="bg-gray-100 text-black mt-16 p-10 rounded-xl">
        <h2 className="text-2xl font-bold">What you'll need</h2>
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <Doc title="Identity Proof" />
          <Doc title="Recent Photo" />
          <Doc title="Current Address" />
          <Doc title="Previous Passport" />
        </div>
      </div>
    </div>
  );
}
