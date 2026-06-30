import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData, saveData } from "../utils/storage";

const defaultProfile = {
  name: "",
  dob: "",
  city: "",
};

const checklist = [
  "Government ID or Aadhaar",
  "Recent passport-size photo",
  "Address proof",
  "10-15 minutes to complete the form",
];

export default function OnboardingSetup() {
  const nav = useNavigate();
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    const user = getData("passport-user");
    if (user) {
      setProfile({
        name: user.name || "",
        dob: user.dob || "",
        city: user.city || "",
      });
    }
  }, []);

  const updateProfile = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const continueToApplication = async () => {
    if (!profile.name || !profile.dob || !profile.city) {
      return alert("Please complete your name, date of birth, and city.");
    }

    const currentUser = getData("passport-user");
    const nextUser = { ...currentUser, ...profile };
    saveData("passport-user", nextUser);

    try {
      await fetch("http://localhost:4000/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: nextUser.email,
          name: profile.name,
          dob: profile.dob,
          city: profile.city,
        }),
      });
    } catch {}

    nav("/apply");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-6 py-10 text-[#18204b]">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl bg-white p-10 shadow-[0_20px_60px_rgba(20,34,94,0.08)]">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5b6bb7]">Welcome to Passport Services</p>
          <h1 className="mt-4 text-5xl font-black text-[#121d84]">Let’s set up your first application</h1>
          <p className="mt-5 max-w-2xl text-xl leading-9 text-[#5d6378]">
            We’ll save these basics for you so the passport form feels shorter, clearer, and easier to finish.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f5568]">Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                className="mt-3 w-full rounded-xl border border-[#d7dceb] bg-[#f8f9fc] px-4 py-4 outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f5568]">City</label>
              <input
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                className="mt-3 w-full rounded-xl border border-[#d7dceb] bg-[#f8f9fc] px-4 py-4 outline-none"
                placeholder="Enter your current city"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-bold uppercase tracking-[0.14em] text-[#4f5568]">Date of Birth</label>
              <input
                type="date"
                value={profile.dob}
                onChange={(e) => updateProfile("dob", e.target.value)}
                className="mt-3 w-full rounded-xl border border-[#d7dceb] bg-[#f8f9fc] px-4 py-4 outline-none"
              />
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-[#f4f7ff] p-6">
            <h2 className="text-2xl font-black text-[#121d84]">What to expect</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d6cbc]">Step 1</p>
                <p className="mt-2 text-lg font-semibold">Fill in personal and address details</p>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d6cbc]">Step 2</p>
                <p className="mt-2 text-lg font-semibold">Upload required documents clearly</p>
              </div>
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#5d6cbc]">Step 3</p>
                <p className="mt-2 text-lg font-semibold">Book an appointment and review your receipt</p>
              </div>
            </div>
          </div>

          <button
            onClick={continueToApplication}
            className="mt-10 rounded-xl bg-[#121d84] px-8 py-4 text-lg font-bold text-white"
          >
            Start New Passport Application →
          </button>
        </section>

        <aside className="rounded-3xl bg-[#121d84] p-10 text-white shadow-[0_20px_60px_rgba(20,34,94,0.14)]">
          <h2 className="text-3xl font-black">Application introduction</h2>
          <p className="mt-5 text-lg leading-9 text-white/80">
            First-time applicants often feel anxious about missing a document or losing progress. This setup saves your basics and shows what you need before you begin.
          </p>

          <div className="mt-10 rounded-2xl bg-white/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9cf68e]">Before you start</p>
            <ul className="mt-5 space-y-4 text-lg text-white/90">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 text-[#9cf68e]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl bg-white/10 p-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9cf68e]">Confidence boosters</p>
            <p className="mt-4 text-lg leading-8 text-white/90">
              Your draft auto-saves as you go, uploaded documents can be checked again later, and your final receipt stays available in the dashboard.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
