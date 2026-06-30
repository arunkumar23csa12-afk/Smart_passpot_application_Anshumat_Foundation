import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getData } from "../utils/storage";

const documentRows = [
  {
    title: "Aadhaar Card",
    key: "aadhaar",
    helper: "Identity proof document",
  },
  {
    title: "Passport Size Photo",
    key: "photo",
    helper: "Recent JPEG or PNG upload",
  },
  {
    title: "Address Proof",
    key: "addressProof",
    helper: "Utility bill, voter ID, or rental agreement",
  },
];

export default function MyDocuments() {
  const nav = useNavigate();
  const savedDocuments = getData("documents") || {};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900">My Documents</h1>
            <p className="mt-2 text-gray-600">Review the files attached to your passport application.</p>
          </div>
          <button
            onClick={() => nav("/documents")}
            className="rounded bg-blue-900 px-5 py-3 text-white"
          >
            Manage Uploads
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {documentRows.map((item) => {
            const doc = savedDocuments[item.key];
            const uploaded = Boolean(doc?.uploaded);

            return (
              <div key={item.key} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{item.helper}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {uploaded ? `Uploaded file: ${doc.name}` : "No file uploaded yet"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      uploaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {uploaded ? "Uploaded" : "Pending"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900">Additional Supporting Files</h2>
          <p className="mt-3 text-gray-700">
            {Array.isArray(savedDocuments.additional) && savedDocuments.additional.length > 0
              ? savedDocuments.additional.join(", ")
              : "No additional supporting documents uploaded."}
          </p>
        </div>
      </main>
    </div>
  );
}
