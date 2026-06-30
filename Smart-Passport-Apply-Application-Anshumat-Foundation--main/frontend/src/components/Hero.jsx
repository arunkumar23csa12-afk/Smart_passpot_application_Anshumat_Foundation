import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const nav = useNavigate();
  const loggedIn = Boolean(localStorage.getItem("passport-user"));

  return (
    <div className="bg-[#0B1F6A] text-white px-10 py-20 grid md:grid-cols-2 items-center gap-8">
      <div>
        <span className="text-xs bg-blue-800 px-3 py-1 rounded">OFFICIAL GOVERNMENT PORTAL</span>
        <h1 className="text-5xl font-bold mt-6 leading-tight">
          Apply for Passport <br />
          <span className="text-green-400">Easily</span>
        </h1>
        <p className="text-gray-300 mt-4 max-w-md">
          Simple 4-step process. Fast, secure, and user-friendly.
        </p>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => nav(loggedIn ? "/dashboard" : "/login")}
            className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold"
          >
            {loggedIn ? "Go to Dashboard →" : "Start Application →"}
          </button>
          <button className="border border-white px-6 py-3 rounded-lg">
            View Requirements
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-10 md:mt-0">
        <img src="/passport.png" alt="passport" className="w-80 rounded-xl shadow-xl" />
      </div>
    </div>
  );
}
