import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveStatus from "../components/SaveStatus";
import { getData, saveData, getSavedMeta, formatSavedTime } from "../utils/storage";
import { saveDraftApplication } from "../utils/drafts";
import { validateAddressInfo } from "../utils/validation";

const defaultForm = {
  first: "",
  last: "",
  dob: "",
  gender: "",
  houseNumber: "",
  street: "",
  city: "",
  pinCode: "",
  state: "",
};

const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

const navItems = [
  { label: "Personal Info", icon: "✓", active: false },
  { label: "Address", icon: "⌂", active: true },
  { label: "Documents", icon: "🗎", active: false },
  { label: "Review", icon: "✎", active: false },
];

export default function AddressInfo() {
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

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const next = () => {
    const err = validateAddressInfo(form);
    if (err) return alert(err);
    nav("/documents");
  };

  const saveDraftAndOpenDashboard = async () => {
    const user = getData("passport-user");
    await saveDraftApplication({
      user,
      step: "Complete address details",
      route: "/address",
    });
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#11153a]">
      <header className="border-b border-black/5 bg-white/95 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-[28px] font-extrabold tracking-[0.14em] text-[#0b1979]">
            PASSPORT SERVICES
          </h1>
          <div className="flex items-center gap-10 text-[18px] text-[#202442]">
            <button className="transition hover:text-[#0b1979]">My Applications</button>
            <button className="transition hover:text-[#0b1979]">Help Center</button>
            <button className="text-[22px]">🔔</button>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#0d1b2a] bg-[#20343d] text-white">
              ☻
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[320px_1fr]">
        <aside className="border-r border-black/5 bg-[#f3f3f4] px-8 py-10">
          <p className="text-[18px] font-bold text-[#0b1979]">Application Progress</p>
          <p className="mt-2 text-[13px] uppercase tracking-[0.3em] text-black/70">Step 3 of 5</p>

          <nav className="mt-12 space-y-2">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-5 px-4 py-4 text-[19px] ${
                  item.active
                    ? "border-l-4 border-[#9cf36d] bg-white font-semibold text-[#0b1979]"
                    : "text-black/75"
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-base ${
                    item.label === "Personal Info"
                      ? "bg-[#7f818d] text-white"
                      : item.active
                        ? "text-[#0b1979]"
                        : "text-black/70"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>

          <button
            onClick={saveDraftAndOpenDashboard}
            className="mt-12 w-full bg-[#d9d9dc] px-6 py-4 text-[18px] font-bold uppercase tracking-[0.14em] text-black/55 transition hover:bg-[#cfd1d6]"
          >
            Save Draft
          </button>
        </aside>

        <main className="px-8 py-12 lg:px-14">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#0b1979] sm:text-5xl">
              03 Step Three of Five: Address Information
            </h2>
            <p className="mt-4 text-xl text-black/80">
              Please provide your permanent residential address for verification.
            </p>
            <div className="mt-5">
              <SaveStatus status={saveState} savedAt={lastSavedAt} message="Progress saved" />
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1fr_350px]">
            <section className="rounded bg-white p-8 shadow-[0_15px_45px_rgba(38,59,137,0.08)] sm:p-12">
              <div className="space-y-10">
                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-black/85">
                    House/Building Number
                  </label>
                  <input
                    value={form.houseNumber}
                    onChange={(e) => updateField("houseNumber", e.target.value)}
                    placeholder="e.g. 42-B, Ground Floor"
                    className="w-full border-b-2 border-[#76798a] bg-[#e7e7e8] px-5 py-5 text-[18px] text-[#5d6577] outline-none transition focus:border-[#0b1979] focus:text-[#11153a]"
                  />
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-black/85">
                    Street/Locality
                  </label>
                  <input
                    value={form.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    placeholder="e.g. Heritage Square, Civil Lines"
                    className="w-full border-b-2 border-[#76798a] bg-[#e7e7e8] px-5 py-5 text-[18px] text-[#5d6577] outline-none transition focus:border-[#0b1979] focus:text-[#11153a]"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-black/85">
                      City/Town
                    </label>
                    <input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="New Delhi"
                      className="w-full border-b-2 border-[#76798a] bg-[#e7e7e8] px-5 py-5 text-[18px] text-[#5d6577] outline-none transition focus:border-[#0b1979] focus:text-[#11153a]"
                    />
                  </div>

                  <div>
                    <label className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-black/85">
                      Pin Code
                    </label>
                    <input
                      value={form.pinCode}
                      onChange={(e) => updateField("pinCode", e.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="110001"
                      className="w-full border-b-2 border-[#76798a] bg-[#e7e7e8] px-5 py-5 text-[18px] text-[#5d6577] outline-none transition focus:border-[#0b1979] focus:text-[#11153a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-black/85">
                    State/Union Territory
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full border-b-2 border-[#76798a] bg-[#e7e7e8] px-5 py-5 text-[18px] text-[#11153a] outline-none transition focus:border-[#0b1979]"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <aside className="space-y-8">
              <div className="rounded bg-[#f7f7f8] px-10 py-10">
                <div className="border-l-4 border-[#0b1979] pl-10">
                  <p className="text-center text-3xl text-[#0b1979]">i</p>
                  <h3 className="mt-2 text-center text-[20px] font-bold text-[#0b1979]">
                    Why we need this information
                  </h3>
                  <p className="mt-6 text-[18px] leading-10 text-black/75">
                    Your address is required for police verification and passport delivery. Ensure the
                    details match your utility bills or government IDs.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded">
                <img src="/passport.png" alt="Passport verification checklist" className="h-[270px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1979] via-[#0b197980] to-transparent" />
                <p className="absolute bottom-8 left-8 text-xl font-semibold uppercase tracking-[0.18em] text-white">
                  Verification Checklist Available
                </p>
              </div>
            </aside>
          </div>

          <div className="mt-14 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => nav("/form")}
              className="text-[18px] font-semibold text-[#0b1979] transition hover:text-[#16279d]"
            >
              ← Back
            </button>
            <button
              onClick={next}
              className="min-w-[240px] bg-[#0b0f7a] px-10 py-6 text-[18px] font-bold text-white shadow-[0_18px_35px_rgba(11,15,122,0.18)] transition hover:bg-[#141c9d]"
            >
              Next Step →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
