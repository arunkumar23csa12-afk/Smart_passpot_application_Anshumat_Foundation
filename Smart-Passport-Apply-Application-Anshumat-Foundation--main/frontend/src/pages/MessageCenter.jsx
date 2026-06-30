import React from "react";
import Navbar from "../components/Navbar";
import { getData } from "../utils/storage";

const messages = [
  {
    id: "MSG-1001",
    title: "Application received",
    body: "We have received your passport application and created your case file.",
    time: "Today, 10:15 AM",
  },
  {
    id: "MSG-1002",
    title: "Upload reminder",
    body: "Please make sure your supporting documents are clear and readable before submission.",
    time: "Yesterday, 4:40 PM",
  },
  {
    id: "MSG-1003",
    title: "Appointment update",
    body: "Your selected appointment details will be confirmed by email after final submission.",
    time: "Yesterday, 11:20 AM",
  },
];

export default function MessageCenter() {
  const applications = getData("passport-applications");
  const latestApplication = Array.isArray(applications) ? applications[0] : null;
  const metadata = latestApplication?.metadata;

  const dynamicMessages = metadata?.emailConfirmation
    ? [
        {
          id: "MSG-EMAIL-STATUS",
          title: "Confirmation email delivered",
          body: `A demo confirmation email for ${latestApplication.id} was sent to ${metadata.emailConfirmation.recipient}.`,
          time: "Just now",
        },
        {
          id: "MSG-EXPORT-STATUS",
          title: "Application records ready",
          body: `Summary PDF: ${metadata.exports?.applicationPdfDownloadedAt ? "downloaded" : "available"} • Receipt: ${metadata.exports?.receiptDownloadedAt ? "downloaded" : "available"} • Share ID: ${metadata.exports?.copiedReferenceAt ? "copied" : "available"}.`,
          time: "Just now",
        },
      ]
    : [];

  const allMessages = [...dynamicMessages, ...messages];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-extrabold text-blue-900">Message Center</h1>
        <p className="mt-2 text-gray-600">Important updates and reminders related to your application.</p>

        <div className="mt-8 space-y-4">
          {allMessages.map((message) => (
            <div key={message.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-900">{message.id}</p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">{message.title}</h2>
                  <p className="mt-2 text-gray-700">{message.body}</p>
                </div>
                <span className="whitespace-nowrap text-sm text-gray-500">{message.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
