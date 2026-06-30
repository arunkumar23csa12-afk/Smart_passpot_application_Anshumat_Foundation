import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SaveStatus from "../components/SaveStatus";
import { getData, saveData, getSavedMeta, formatSavedTime } from "../utils/storage";

const defaultDocuments = {
  aadhaar: { name: "", uploaded: false },
  photo: { name: "", uploaded: false },
  addressProof: { name: "", uploaded: false },
  additional: [],
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12.5 10 17l9-10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M7 16l3.5-3.5L13 15l2-2 2 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s6-5.8 6-10.5A6 6 0 0 0 6 9.5C6 14.2 12 20 12 20Z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 18h8a4 4 0 0 0 .7-7.9A5.5 5.5 0 0 0 6.2 8.4 4.5 4.5 0 0 0 8 18Z" />
      <path d="M12 15V8.5" strokeLinecap="round" />
      <path d="m9.5 11 2.5-2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const documentConfig = [
  {
    key: "aadhaar",
    title: "Aadhaar Card",
    helper: "File:",
    fallback: "Aadhaar front/back PDF",
    accept: ".pdf,.jpg,.jpeg,.png",
    icon: CheckIcon,
  },
  {
    key: "photo",
    title: "Passport Size Photo",
    helper: "Format:",
    fallback: "JPEG/PNG only",
    accept: ".jpg,.jpeg,.png",
    icon: PhotoIcon,
  },
  {
    key: "addressProof",
    title: "Address Proof",
    helper: "Accepted:",
    fallback: "Voter ID, utility bill, or rental agreement",
    accept: ".pdf,.jpg,.jpeg,.png",
    icon: PinIcon,
  },
];

export default function DocumentUpload() {
  const nav = useNavigate();
  const [documents, setDocuments] = useState(defaultDocuments);
  const [dragActive, setDragActive] = useState(false);
  const [saveState, setSaveState] = useState("saved");
  const [lastSavedAt, setLastSavedAt] = useState("");
  const fileInputs = useRef({});
  const extraInputRef = useRef(null);

  useEffect(() => {
    const saved = getData("documents");
    if (saved) {
      setDocuments({
        ...defaultDocuments,
        ...saved,
        aadhaar: { ...defaultDocuments.aadhaar, ...(saved.aadhaar || {}) },
        photo: { ...defaultDocuments.photo, ...(saved.photo || {}) },
        addressProof: { ...defaultDocuments.addressProof, ...(saved.addressProof || {}) },
        additional: Array.isArray(saved.additional) ? saved.additional : [],
      });
    }
    const meta = getSavedMeta("documents");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));
  }, []);

  useEffect(() => {
    setSaveState("saving");
    saveData("documents", documents);
    const meta = getSavedMeta("documents");
    if (meta?.savedAt) setLastSavedAt(formatSavedTime(meta.savedAt));

    const timeoutId = window.setTimeout(() => {
      setSaveState("saved");
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [documents]);

  const allRequiredUploaded = useMemo(
    () => documentConfig.every((item) => documents[item.key]?.uploaded),
    [documents]
  );

  const assignFile = (key, file) => {
    if (!file) return;
    setDocuments((current) => ({
      ...current,
      [key]: {
        name: file.name.toUpperCase(),
        uploaded: true,
      },
    }));
  };

  const assignAdditionalFiles = (files) => {
    if (!files?.length) return;
    setDocuments((current) => ({
      ...current,
      additional: [...current.additional, ...Array.from(files, (file) => file.name.toUpperCase())],
    }));
  };

  const openPicker = (key) => {
    fileInputs.current[key]?.click();
  };

  const openAdditionalPicker = () => {
    extraInputRef.current?.click();
  };

  const onDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    assignAdditionalFiles(event.dataTransfer.files);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfc] px-4 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[980px] px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
        <div>
          <h1 className="text-4xl font-black text-[#101b84] sm:text-5xl lg:text-[3.45rem]">
            Step 4: Document Upload
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-9 text-[#565b6f] sm:text-[20px]">
            Please provide the necessary identification and residency documents. Ensure all scans are
            clear and readable to avoid processing delays.
          </p>
          <div className="mt-5">
            <SaveStatus status={saveState} savedAt={lastSavedAt} message="Documents uploaded successfully" />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_290px]">
          <div className="space-y-5">
            {documentConfig.map((item) => {
              const doc = documents[item.key];
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className={`flex items-center justify-between rounded-md bg-white px-7 py-7 shadow-[0_8px_22px_rgba(18,31,93,0.05)] ${
                    doc.uploaded ? "border-l-[5px] border-[#9ef498]" : ""
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                        doc.uploaded ? "bg-[#eaf8e6] text-[#144d27]" : "bg-[#ededf0] text-[#8b8fa0]"
                      }`}
                    >
                      <Icon />
                    </div>

                    <div>
                      <h2 className="text-[22px] font-bold text-[#232632] sm:text-[23px]">{item.title}</h2>
                      <p className="mt-1 text-sm uppercase tracking-[0.08em] text-[#5f6373] sm:text-[15px]">
                        {item.helper} {doc.name || item.fallback}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {doc.uploaded ? (
                      <span className="inline-flex rounded-full bg-[#ddf7d6] px-6 py-3 text-[17px] font-semibold text-[#205e2c]">
                        Uploaded
                      </span>
                    ) : (
                      <>
                        <input
                          ref={(node) => {
                            fileInputs.current[item.key] = node;
                          }}
                          type="file"
                          accept={item.accept}
                          className="hidden"
                          onChange={(event) => assignFile(item.key, event.target.files?.[0])}
                        />
                        <button
                          type="button"
                          onClick={() => openPicker(item.key)}
                          className="rounded-md bg-[#dedee1] px-8 py-4 text-[18px] font-black uppercase tracking-[0.08em] text-[#101b84] transition hover:bg-[#d2d2d8]"
                        >
                          Upload
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="rounded-md bg-[#f2f2f5] px-8 py-10">
            <div className="flex items-center gap-3 text-[#101b84]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-current text-lg font-bold">
                i
              </span>
              <h3 className="text-[20px] font-bold">Guidelines</h3>
            </div>

            <div className="mt-7 space-y-6 text-[18px] leading-10 text-[#585d70]">
              <p className="flex gap-4">
                <span className="mt-4 h-2.5 w-2.5 shrink-0 rounded-full bg-[#99f08a]" />
                <span>Max file size: 5MB per document.</span>
              </p>
              <p className="flex gap-4">
                <span className="mt-4 h-2.5 w-2.5 shrink-0 rounded-full bg-[#99f08a]" />
                <span>Supported formats: PDF, JPG, PNG.</span>
              </p>
              <p className="flex gap-4">
                <span className="mt-4 h-2.5 w-2.5 shrink-0 rounded-full bg-[#99f08a]" />
                <span>Ensure text is not blurred or cut off.</span>
              </p>
            </div>
          </aside>
        </div>

        <input
          ref={extraInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(event) => assignAdditionalFiles(event.target.files)}
        />

        <button
          type="button"
          onClick={openAdditionalPicker}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setDragActive(false);
          }}
          onDrop={onDrop}
          className={`mt-12 w-full rounded-2xl border-[3px] border-dashed px-6 py-20 text-center transition ${
            dragActive
              ? "border-[#101b84] bg-[#eff1ff]"
              : "border-[#cdd0e2] bg-white hover:border-[#101b84]"
          }`}
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e5e7ff] text-[#101b84]">
            <CloudUploadIcon />
          </div>
          <h3 className="mt-8 text-3xl font-black text-[#101b84] sm:text-[2.15rem]">
            Click or drag and drop files here
          </h3>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-9 text-[#595f73] sm:text-[20px]">
            Upload additional supporting documents like Birth Certificate or Marriage Certificate.
          </p>
          {documents.additional.length > 0 && (
            <p className="mx-auto mt-6 max-w-3xl text-sm uppercase tracking-[0.08em] text-[#101b84]">
              Added: {documents.additional.join(", ")}
            </p>
          )}
        </button>

        <div className="mt-10 flex items-center justify-between">
          <button onClick={() => nav("/address")} className="text-lg font-semibold text-[#2448e6]">
            ← Back
          </button>
          <button
            onClick={() => nav("/appointment")}
            disabled={!allRequiredUploaded}
            className={`rounded-md px-10 py-4 text-lg font-semibold text-white transition ${
              allRequiredUploaded
                ? "bg-[#263f9d] hover:bg-[#203483]"
                : "cursor-not-allowed bg-[#9aa6d7]"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
