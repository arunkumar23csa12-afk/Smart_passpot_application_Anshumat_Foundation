import React from "react";

export default function SaveStatus({ status, savedAt, message = "Progress saved" }) {
  const label =
    status === "saving"
      ? "Saving..."
      : savedAt
        ? `${message} • Last saved at ${savedAt}`
        : message;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        status === "saving"
          ? "bg-amber-50 text-amber-700"
          : "bg-emerald-50 text-emerald-700"
      }`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${status === "saving" ? "bg-amber-500" : "bg-emerald-500"}`} />
      <span>{label}</span>
    </div>
  );
}
