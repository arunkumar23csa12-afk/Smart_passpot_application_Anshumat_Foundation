import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getData, saveData } from "../utils/storage";
import { clearCurrentDraftApplication } from "../utils/drafts";
import { downloadPdfDocument } from "../utils/pdf";

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2.8">
      <path d="M5 12.5 9.7 17 19 7.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v5h5" />
      <path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9zm4-3v6m0-3h2m-2 0h1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2Z" />
      <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 0 1 15.4-6.4" />
      <path d="m18 3 1.8 4.7L15 9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12A9 9 0 0 1 5.6 18.4" />
      <path d="m6 21-1.8-4.7L9 14.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.8" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" strokeLinecap="round" />
      <path d="M8 14h3M8 17h3" strokeLinecap="round" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 4h12v16H6z" />
      <path d="M10 9a2 2 0 1 1 3.2 1.6c-.8.6-1.2 1-1.2 2" strokeLinecap="round" />
      <circle cx="12" cy="16.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const relatedServices = [
  {
    title: "Track Status",
    description: "Real-time updates on your processing stage.",
    icon: TrackIcon,
  },
  {
    title: "Reschedule",
    description: "Modify your appointment if needed.",
    icon: CalendarIcon,
  },
  {
    title: "FAQs",
    description: "Common questions about this application.",
    icon: FaqIcon,
  },
];

export default function Confirmation() {
  const nav = useNavigate();
  const location = useLocation();
  const [appointment, setAppointment] = useState(null);
  const [createdApplication, setCreatedApplication] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    setAppointment(getData("appointment"));
  }, []);

  useEffect(() => {
    const submissionKey = location.state?.submissionKey;
    const user = getData("passport-user");

    if (!submissionKey || !user?.email) return;

    const processedKey = getData("last-submission-key");
    if (processedKey === submissionKey) {
      setCreatedApplication(getData("last-created-application"));
      return;
    }

    const appointmentData = getData("appointment") || {};
    const newApplicationPayload = {
      email: user.email,
      title: "New Passport Application",
      status: "Submitted",
      step: `Appointment booked for ${appointmentData.date || "your selected date"}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      route: "/success",
      metadata: {
        emailConfirmation: {
          status: "Sent",
          recipient: user.email,
          sentAt: new Date().toISOString(),
          note: "Demo confirmation email recorded successfully for assignment review.",
        },
        exports: {},
      },
    };

    const saveLocally = (application) => {
      const existing = getData("passport-applications");
      const nextApplications = Array.isArray(existing) ? [application, ...existing] : [application];
      saveData("passport-applications", nextApplications);
      saveData("last-submission-key", submissionKey);
      saveData("last-created-application", application);
      setCreatedApplication(application);
    };

    fetch("http://localhost:4000/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newApplicationPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Create application failed");
        return res.json();
      })
      .then((data) => {
        if (data?.application) {
          clearCurrentDraftApplication();
          saveLocally(data.application);
        }
      })
      .catch(() => {
        const fallbackApplication = {
          id: `APP-${Math.floor(Math.random() * 9000) + 1000}-LF`,
          title: newApplicationPayload.title,
          status: newApplicationPayload.status,
          step: newApplicationPayload.step,
          date: newApplicationPayload.date,
          route: newApplicationPayload.route,
          metadata: newApplicationPayload.metadata,
        };
        clearCurrentDraftApplication();
        saveLocally(fallbackApplication);
      });
  }, [location.state]);

  const referenceId = useMemo(() => {
    const slot = createdApplication?.id?.replace(/[^0-9]/g, "") || appointment?.slot?.replace(/[^0-9]/g, "") || "2345";
    return `#P1${slot.slice(0, 4).padEnd(4, "5")}`;
  }, [appointment, createdApplication]);

  const applicant = getData("passport-user");

  const syncMetadata = async (metadataPatch) => {
    if (!createdApplication?.id) return;

    const nextApplication = {
      ...createdApplication,
      metadata: {
        ...(createdApplication.metadata || {}),
        ...metadataPatch,
        exports: {
          ...((createdApplication.metadata && createdApplication.metadata.exports) || {}),
          ...((metadataPatch && metadataPatch.exports) || {}),
        },
      },
    };

    setCreatedApplication(nextApplication);
    saveData("last-created-application", nextApplication);

    const cachedApplications = getData("passport-applications");
    if (Array.isArray(cachedApplications)) {
      const nextApplications = cachedApplications.map((application) =>
        application.id === nextApplication.id ? nextApplication : application
      );
      saveData("passport-applications", nextApplications);
    }

    try {
      await fetch(`http://localhost:4000/api/applications/${createdApplication.id}/metadata`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadataPatch),
      });
    } catch {}
  };

  const downloadApplicationPdf = () => {
    downloadPdfDocument({
      filename: "passport-application-summary.pdf",
      title: "Passport Application Summary",
      subtitle: `Reference ${referenceId}`,
      sections: [
        {
          heading: "Applicant Details",
          lines: [
            `Name: ${applicant?.name || "Applicant"}`,
            `Email: ${applicant?.email || "Not available"}`,
            `Phone: ${applicant?.phone || "Not available"}`,
          ],
        },
        {
          heading: "Application Details",
          lines: [
            `Application ID: ${createdApplication?.id || "Pending sync"}`,
            `Status: ${createdApplication?.status || "Submitted"}`,
            `Office: ${appointment?.office || "Not selected"}`,
            `Appointment Date: ${appointment?.date || "Not selected"}`,
            `Appointment Slot: ${appointment?.slot || "Not selected"}`,
          ],
        },
      ],
    });
    syncMetadata({
      exports: {
        applicationPdfDownloadedAt: new Date().toISOString(),
      },
    });
    setActionMessage("Application summary downloaded.");
  };

  const downloadReceipt = () => {
    downloadPdfDocument({
      filename: "passport-appointment-receipt.pdf",
      title: "Passport Appointment Receipt",
      subtitle: `Generated ${new Date().toLocaleString()}`,
      sections: [
        {
          heading: "Booking Reference",
          lines: [
            `Reference ID: ${referenceId}`,
            `Application ID: ${createdApplication?.id || "Pending sync"}`,
          ],
        },
        {
          heading: "Appointment Details",
          lines: [
            `Office: ${appointment?.office || "Not selected"}`,
            `Date: ${appointment?.date || "Not selected"}`,
            `Slot: ${appointment?.slot || "Not selected"}`,
          ],
        },
        {
          heading: "Applicant",
          lines: [
            `Name: ${applicant?.name || "Applicant"}`,
            `Email: ${applicant?.email || "Not available"}`,
          ],
        },
      ],
    });
    syncMetadata({
      exports: {
        receiptDownloadedAt: new Date().toISOString(),
      },
    });
    setActionMessage("Appointment receipt downloaded.");
  };

  const copyReferenceId = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      syncMetadata({
        exports: {
          copiedReferenceAt: new Date().toISOString(),
        },
      });
      setActionMessage("Reference ID copied.");
    } catch {
      setActionMessage("Could not copy automatically. Please copy the reference ID manually.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-[#1d2136]">
      <header className="border-b border-black/5 bg-white px-10 py-6">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between">
          <button onClick={() => nav("/dashboard")} className="text-[28px] font-black text-[#121d84]">
            GovPortal
          </button>

          <nav className="hidden items-center gap-14 text-[20px] text-[#4c5060] md:flex">
            <button onClick={() => nav("/dashboard")}>Dashboard</button>
            <button className="border-b-[3px] border-[#121d84] pb-2 text-[#121d84]">Applications</button>
            <button>Services</button>
            <button>Support</button>
          </nav>

          <div className="flex items-center gap-7 text-[#121d84]">
            <BellIcon />
            <UserIcon />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-6 py-16 sm:px-8 lg:px-0">
        <section className="grid overflow-hidden rounded-2xl bg-white shadow-[0_22px_60px_rgba(27,40,111,0.08)] lg:grid-cols-[500px_1fr]">
          <div className="relative overflow-hidden bg-[#12157b] px-12 py-16 text-white">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-br-[28px] border-b-8 border-r-8 border-[#2f39a5]" />
            <div className="absolute left-[100px] top-[300px] h-[340px] w-[340px] rounded-[24px] border border-white/10" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-[28px] bg-[#9cf68e] text-[#12157b]">
                <CheckIcon />
              </div>

              <div className="mt-12">
                <h1 className="text-[40px] font-black leading-tight">Application Submitted!</h1>
                <p className="mt-4 text-[18px] uppercase tracking-[0.2em] text-white/75">Reference ID</p>
                <p className="mt-1 text-[42px] font-black">{referenceId}</p>
              </div>
            </div>
          </div>

          <div className="px-10 py-14 sm:px-14">
            <div className="border-l-4 border-[#9cf68e] pl-8">
              <h2 className="text-[28px] font-black text-[#232632]">What happens next?</h2>
              <p className="mt-5 max-w-[520px] text-[20px] leading-10 text-[#5c6072]">
                Your application has been received. You will receive an email confirmation shortly with
                your appointment details.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-[#f3f7ff] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#12157b]">Email confirmation</p>
              <p className="mt-2 text-[16px] leading-7 text-[#4f5568]">
                Demo confirmation email sent to{" "}
                <span className="font-semibold">
                  {createdApplication?.metadata?.emailConfirmation?.recipient || applicant?.email || "your inbox"}
                </span>
                .
              </p>
              <p className="mt-2 text-sm text-[#68708a]">
                {createdApplication?.metadata?.emailConfirmation?.note || "A confirmation receipt is stored in the application record for review."}
              </p>
            </div>

            <button
              onClick={() => nav("/dashboard")}
              className="mt-12 flex w-full items-center justify-center gap-4 rounded-md bg-[#12157b] px-8 py-6 text-[20px] font-bold text-white"
            >
              <span>Go to Dashboard</span>
              <span className="text-3xl">→</span>
            </button>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <button onClick={downloadApplicationPdf} className="flex items-center justify-center gap-3 rounded-md bg-[#dedee1] px-6 py-5 text-[18px] font-semibold text-[#636775]">
                <PdfIcon />
                <span>Download PDF</span>
              </button>
              <button onClick={downloadReceipt} className="flex items-center justify-center gap-3 rounded-md bg-[#dedee1] px-6 py-5 text-[18px] font-semibold text-[#636775]">
                <ReceiptIcon />
                <span>Receipt</span>
              </button>
            </div>

            <button
              onClick={copyReferenceId}
              className="mt-4 text-[16px] font-semibold text-[#12157b]"
            >
              Share / Copy Application ID
            </button>

            {actionMessage && (
              <p className="mt-4 text-sm font-semibold text-[#1f6a38]">{actionMessage}</p>
            )}

            <div className="mt-16 flex gap-4 text-[#9b9eab]">
              <InfoIcon />
              <p className="max-w-[560px] text-[15px] leading-8">
                If you do not see the email in your inbox within 15 minutes, please check your spam
                folder or contact support.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-[28px] font-black text-[#121d84]">Related Services</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedServices.map((service) => {
              const Icon = service.icon;

              return (
                <div key={service.title} className="rounded-2xl bg-white px-8 py-8 shadow-[0_14px_40px_rgba(27,40,111,0.05)]">
                  <div className="text-[#121d84]">
                    <Icon />
                  </div>
                  <h3 className="mt-8 text-[22px] font-black text-[#232632]">{service.title}</h3>
                  <p className="mt-4 max-w-[260px] text-[18px] leading-9 text-[#5d6071]">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white px-10 py-10">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-8 text-[18px] text-[#5d6070] lg:flex-row lg:items-center lg:justify-between">
          <div className="font-black text-[#121d84]">GovPortal</div>

          <div className="flex flex-wrap gap-10">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
            <span>Contact Us</span>
          </div>

          <div>© 2024 Department of State Affairs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
