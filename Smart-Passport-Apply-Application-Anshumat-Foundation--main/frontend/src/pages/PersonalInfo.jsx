import React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Input from "../components/Input";
import ProgressBar from "../components/ProgressBar";
import SaveStatus from "../components/SaveStatus";
import { saveData, getData, getSavedMeta, formatSavedTime } from "../utils/storage";
import { saveDraftApplication } from "../utils/drafts";
import { validatePersonalInfo } from "../utils/validation";

const defaultForm = { first: "", last: "", dob: "", gender: "" };

export default function PersonalInfo() {
  const nav = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [saveState, setSaveState] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState("");

  useEffect(() => {
    const saved = getData("form");
    if (saved) setForm({ ...defaultForm, ...saved });
    const meta = getSavedMeta("form");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));
  }, []);

  useEffect(() => {
    setSaveState("saving");
    saveData("form", form);
    const meta = getSavedMeta("form");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));

    const timeoutId = window.setTimeout(() => {
      setSaveState("saved");
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [form]);

  const next = () => {
    const err = validatePersonalInfo(form);
    if (err) return alert(err);
    nav("/address");
  };

  const saveDraftAndOpenDashboard = async () => {
    const user = getData("passport-user");
    await saveDraftApplication({
      user,
      step: "Complete personal information",
      route: "/form",
    });
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#0b1f6a]">
      <div className="bg-white shadow-sm border-b px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Passport Portal</h1>
            <p className="text-sm text-gray-500">Application Progress · Passport Renewal</p>
          </div>
          <div className="space-x-3">
            <button className="px-4 py-2 rounded-md bg-white border text-gray-700">?</button>
            <button className="px-4 py-2 rounded-md bg-white border text-gray-700">🔔</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-8 py-8">
        <aside className="md:col-span-1 bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h3 className="text-lg font-bold">Application Progress</h3>
          <p className="text-sm text-gray-500">Passport Renewal</p>
          <nav className="space-y-2 mt-4">
            <button className="w-full text-left px-3 py-2 rounded-md bg-blue-50 text-blue-900 font-semibold">Personal Info</button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Address</button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Documents</button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">Review</button>
          </nav>
          <button onClick={saveDraftAndOpenDashboard} className="w-full bg-blue-900 text-white px-4 py-2 rounded-md">Save Draft</button>
        </aside>

        <main className="md:col-span-3 bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-3xl font-bold text-[#2b5db4]">02</p>
              <p className="text-sm uppercase text-green-500 tracking-wider">Step Two of Five</p>
              <h2 className="text-4xl font-extrabold mt-2">Personal Information</h2>
            </div>
            <SaveStatus status={saveState} savedAt={lastSavedAt} message="Application draft saved" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Input
              label="First Name"
              value={form.first}
              onChange={(e) => setForm({ ...form, first: e.target.value })}
              placeholder="Enter given names"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <Input
              label="Last Name"
              value={form.last}
              onChange={(e) => setForm({ ...form, last: e.target.value })}
              placeholder="Enter family name"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <div>
              <label className="text-xs text-gray-500">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none"
              />
            </div>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={saveDraftAndOpenDashboard} className="text-blue-700 font-semibold">← Back</button>
            <button onClick={next} className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow">Next Step →</button>
          </div>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <p className="font-semibold">Why we need this information</p>
            <p className="text-sm text-gray-700 mt-1">Your personal details must match your current legal identity documents. This information will be used to verify your citizenship and create your biometric passport record.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
