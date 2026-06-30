import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveStatus from "../components/SaveStatus";
import { getData, saveData, getSavedMeta, formatSavedTime } from "../utils/storage";

const navItems = [
  { label: "Personal Info", icon: "◔", active: false },
  { label: "Address", icon: "⌂", active: false },
  { label: "Documents", icon: "🗎", active: false },
  { label: "Appointment", icon: "◫", active: true },
  { label: "Review", icon: "☑", active: false },
];

const officeOptions = [
  "Regional Passport Office, Main City Center",
  "Regional Passport Office, North District",
  "Passport Seva Kendra, East Zone",
];

const calendarDays = [
  ["26", false, false],
  ["27", false, false],
  ["28", false, false],
  ["29", false, false],
  ["30", false, false],
  ["1", false, false],
  ["2", false, false],
  ["3", true, false],
  ["4", true, false],
  ["5", true, false],
  ["6", true, false],
  ["7", true, false],
  ["8", true, false],
  ["9", true, false],
  ["10", true, true],
  ["11", true, false],
  ["12", true, false],
  ["13", true, false],
  ["14", true, false],
  ["15", true, false],
  ["16", true, false],
];

const slotOptions = [
  { label: "10:00 AM", available: true },
  { label: "11:30 AM", available: true },
  { label: "2:00 PM", available: true },
  { label: "3:30 PM", available: false },
];

const defaultAppointment = {
  office: officeOptions[0],
  date: "October 10, 2024",
  day: "10",
  slot: "11:30 AM",
};

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18H5.5a1 1 0 0 1-.8-1.6l1.1-1.5c.4-.5.7-1.2.7-1.9V10a5.5 5.5 0 1 1 11 0v3c0 .7.2 1.4.7 1.9l1.1 1.5a1 1 0 0 1-.8 1.6H18" />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
      <path d="M6 12.5 10.2 17 18 8.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Appointment() {
  const nav = useNavigate();
  const [appointment, setAppointment] = useState(defaultAppointment);
  const [saveState, setSaveState] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState("");

  useEffect(() => {
    const saved = getData("appointment");
    if (saved) setAppointment({ ...defaultAppointment, ...saved });
    const meta = getSavedMeta("appointment");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));
  }, []);

  useEffect(() => {
    setSaveState("saving");
    saveData("appointment", appointment);
    const meta = getSavedMeta("appointment");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));

    const timeoutId = window.setTimeout(() => {
      setSaveState("saved");
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [appointment]);

  const confirm = () => {
    if (!appointment.slot) return;
    nav("/success", { state: { submissionKey: `${Date.now()}` } });
  };

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-[#171b39]">
      <header className="border-b border-black/5 bg-white px-8 py-6">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between">
          <h1 className="text-[28px] font-black text-[#121d84]">Passport Connect</h1>
          <div className="flex items-center gap-10 text-[#4d5060]">
            <BellIcon />
            <UserIcon />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1700px] grid-cols-1 lg:grid-cols-[360px_1fr]">
        <aside className="flex min-h-[calc(100vh-96px)] flex-col justify-between bg-[#f1f1f2]">
          <div className="px-10 py-12">
            <div>
              <p className="text-[20px] font-black uppercase text-[#121d84]">Application Progress</p>
              <p className="mt-2 text-[18px] tracking-[0.14em] text-black/70">Step 4 of 5</p>
            </div>

            <nav className="mt-16 space-y-3">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-5 px-6 py-5 text-[20px] ${
                    item.active
                      ? "border-l-4 border-[#98f08d] bg-white font-semibold text-[#121d84]"
                      : "text-[#505563]"
                  }`}
                >
                  <span className="flex h-9 w-9 items-center justify-center text-[24px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </nav>
          </div>

          <div className="px-10 py-12 text-[16px] uppercase tracking-[0.14em] text-[#5d6070]">
            Draft Status: <span className="font-semibold text-[#121d84]">{lastSavedAt ? `Saved at ${lastSavedAt}` : "Saved just now"}</span>
          </div>
        </aside>

        <main className="px-8 py-10 lg:px-14">
          <div>
            <h2 className="text-5xl font-black text-[#121d84] sm:text-6xl">Step 4: Book Appointment</h2>
            <p className="mt-5 text-[22px] text-[#5e6173]">
              Select your preferred passport office, date, and time slot to finalize your visit.
            </p>
            <div className="mt-5">
              <SaveStatus status={saveState} savedAt={lastSavedAt} message="Booking preferences saved" />
            </div>
          </div>

          <div className="mt-12 grid gap-8 xl:grid-cols-[1fr_470px]">
            <div className="space-y-8">
              <section className="border-l-4 border-[#98f08d] bg-white px-10 py-10 shadow-[0_8px_24px_rgba(24,34,91,0.04)]">
                <label className="block text-[18px] font-black uppercase tracking-[0.14em] text-[#414655]">
                  Select Passport Office
                </label>
                <div className="relative mt-6">
                  <select
                    value={appointment.office}
                    onChange={(e) => setAppointment((current) => ({ ...current, office: e.target.value }))}
                    className="w-full appearance-none border-2 border-[#9498aa] bg-[#f4f4f5] px-6 py-7 text-[22px] font-medium text-[#121d84] outline-none"
                  >
                    {officeOptions.map((office) => (
                      <option key={office} value={office}>
                        {office}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-4xl text-[#7d8294]">
                    ˅
                  </span>
                </div>
              </section>

              <section className="bg-white px-10 py-8 shadow-[0_8px_24px_rgba(24,34,91,0.04)]">
                <div className="flex items-center justify-between">
                  <h3 className="text-[28px] font-black text-[#121d84]">Select Date</h3>
                  <div className="flex items-center gap-12 text-[20px] font-semibold text-[#242838]">
                    <button type="button">‹</button>
                    <span className="text-[21px]">October 2024</span>
                    <button type="button">›</button>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-7 gap-y-7 text-center">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                    <div key={day} className="text-[16px] font-bold tracking-[0.1em] text-[#c5c7d5]">
                      {day}
                    </div>
                  ))}

                  {calendarDays.map(([day, active, selected]) => {
                    const isMarked = day === "5" || day === "11" || day === "12";
                    const isSelected = appointment.day === day || (selected && appointment.day === "10");

                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={!active}
                        onClick={() =>
                          active &&
                          setAppointment((current) => ({
                            ...current,
                            day,
                            date: `October ${day}, 2024`,
                          }))
                        }
                        className={`relative mx-auto flex h-[92px] w-[92px] items-center justify-center text-[23px] ${
                          !active
                            ? "text-[#e1e2ea]"
                            : isSelected
                              ? "border-[6px] border-[#c3c6ee] bg-[#12157b] font-black text-white"
                              : isMarked
                                ? "bg-[#9cf28f] font-black text-[#12157b]"
                                : "text-[#25293c]"
                        }`}
                      >
                        {day}
                        {isMarked && !isSelected && <span className="absolute bottom-2 text-[#12157b]">•</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <aside className="bg-[#f2f2f3] px-10 py-10 shadow-[0_8px_24px_rgba(24,34,91,0.04)]">
              <div className="flex items-center gap-4 text-[#121d84]">
                <ClockIcon />
                <h3 className="text-[24px] font-black">Available Slots</h3>
              </div>

              <p className="mt-10 text-[20px] text-[#5c6070]">
                Selected Date: <span className="font-black text-[#121d84]">{appointment.date}</span>
              </p>

              <div className="mt-12 space-y-4">
                {slotOptions.map((slot) => {
                  const selected = appointment.slot === slot.label;

                  return (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => slot.available && setAppointment((current) => ({ ...current, slot: slot.label }))}
                      className={`flex w-full items-center justify-between px-8 py-7 text-left text-[24px] font-black ${
                        !slot.available
                          ? "bg-white text-[#c7cad7]"
                          : selected
                            ? "border-l-4 border-[#98f08d] bg-[#12157b] text-white"
                            : "bg-white text-[#121d84]"
                      }`}
                    >
                      <span>{slot.label}</span>
                      {selected ? (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#b7f88a] text-[#12157b]">
                          <CheckIcon />
                        </span>
                      ) : !slot.available ? (
                        <span className="text-[16px] font-bold uppercase tracking-[0.08em]">Fully Booked</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-10 h-[210px] overflow-hidden bg-[linear-gradient(135deg,#d7d8ea_0%,#c9cada_38%,#ececf3_100%)]">
                <div className="flex h-full items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl text-[#12157b] shadow">
                    ⌖
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={confirm}
                className="mt-12 w-full bg-[#12157b] px-8 py-8 text-[22px] font-black uppercase tracking-[0.12em] text-white shadow-[0_18px_38px_rgba(18,21,123,0.22)] transition hover:bg-[#191da0]"
              >
                Confirm Booking →
              </button>

              <button
                type="button"
                onClick={() => nav("/documents")}
                className="mt-10 w-full text-[18px] font-bold uppercase tracking-[0.14em] text-[#121d84]"
              >
                ← Back to Documents
              </button>
            </aside>
          </div>
        </main>
      </div>

      <footer className="border-t border-black/5 bg-[#f6f6f7] px-8 py-8">
        <div className="mx-auto flex max-w-[1700px] flex-wrap justify-end gap-14 text-[18px] uppercase tracking-[0.14em] text-[#4f5464]">
          <span>Privacy Policy</span>
          <span>Support</span>
          <span>Terms of Service</span>
        </div>
      </footer>
    </div>
  );
}
