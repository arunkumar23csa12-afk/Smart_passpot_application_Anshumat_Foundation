import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

export default function VerificationSuccess() {
  const nav = useNavigate();
  const { state } = useLocation();
  const mode = state?.mode || "login";
  const phone = state?.phone;
  const target = "/dashboard";
  const label = "Proceed to Dashboard";

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-xl shadow grid md:grid-cols-2 overflow-hidden">
        <div className="bg-blue-900 text-white p-10">
          <h2 className="text-2xl font-bold">Identity Secured.</h2>
          <p className="text-gray-300 mt-4">Verification successful for {phone || "your number"}.</p>
          <p className="text-gray-300 mt-2">
            {mode === "signup"
              ? "Account created. Now complete your passport application."
              : "Welcome back! Continue to your dashboard."}
          </p>
        </div>
        <div className="p-10 text-center">
          <div className="bg-green-100 w-16 h-16 mx-auto flex items-center justify-center rounded-xl">✔</div>
          <h2 className="text-2xl font-bold text-blue-900 mt-4">Verification Successful</h2>
          <button
            onClick={() => nav(target)}
            className="mt-6 w-full bg-blue-900 text-white py-3 rounded-lg"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
