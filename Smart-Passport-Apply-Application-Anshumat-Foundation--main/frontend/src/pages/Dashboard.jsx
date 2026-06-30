import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { getData, saveData } from "../utils/storage";

const demoSeedApplications = [
  {
    id: "APP-9832-X1",
    title: "Passport Renewal",
    status: "In Progress",
    step: "Upload identity documents",
    date: "Oct 12, 2023",
    route: "/documents",
  },
  {
    id: "APP-4402-QB",
    title: "New Passport Application",
    status: "Awaiting Appointment",
    step: "Schedule appointment",
    date: "Sep 28, 2023",
    route: "/appointment",
  },
];

const mergeApplications = (...groups) => {
  const merged = [];

  groups.flat().forEach((application) => {
    if (!application?.id) return;
    if (!merged.some((item) => item.id === application.id)) {
      merged.push(application);
    }
  });

  return merged;
};

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("passport-user") || "{}"));
  const [applications, setApplications] = useState(demoSeedApplications);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("passport-user") || "null");
    if (!currentUser || !currentUser.phone) return;

    setUser(currentUser);
    const isDemoUser = currentUser.email === "hire-me@anshumat.org";

    fetch(`http://localhost:4000/api/applications?email=${encodeURIComponent(currentUser.email)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch applications failed");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.applications)) {
          const localDrafts = getData("passport-applications");
          const localList = Array.isArray(localDrafts) ? localDrafts : [];
          const merged = mergeApplications(
            isDemoUser ? demoSeedApplications : [],
            data.applications,
            localList
          );

          setApplications(merged);
          saveData("passport-applications", merged);
        }
      })
      .catch((error) => {
        console.warn("Backend apps fetch failed: ", error);
        const fallback = getData("passport-applications");
        const merged = mergeApplications(
          isDemoUser ? demoSeedApplications : [],
          Array.isArray(fallback) ? fallback : []
        );
        setApplications(merged);
        saveData("passport-applications", merged);
      });
  }, []);

  const cancelApplication = async (applicationId) => {
    const confirmed = window.confirm("Do you want to cancel this application?");
    if (!confirmed) return;

    try {
      const result = await fetch(`http://localhost:4000/api/applications/${applicationId}`, {
        method: "DELETE",
      });
      if (!result.ok) throw new Error("Cancel application failed");
    } catch (error) {
      console.warn("Backend cancel failed, applying local update only.", error);
    }

    setApplications((current) => {
      const nextApplications = current.filter((application) => application.id !== applicationId);
      saveData("passport-applications", nextApplications);
      return nextApplications;
    });
  };

  const getContinueRoute = (application) => {
    if (application.route) return application.route;
    if (application.status === "Submitted") return "/success";
    if (application.step?.toLowerCase().includes("appointment")) return "/appointment";
    if (application.step?.toLowerCase().includes("document")) return "/documents";
    return "/form";
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <aside className="w-64 bg-white border-r h-screen sticky top-0 p-6">
          <h2 className="text-xl font-bold text-blue-900">Passport Portal</h2>
          <p className="text-gray-500 mt-1">Welcome back</p>
          <div className="mt-6 space-y-2">
            <button onClick={() => nav("/")} className="w-full text-left px-3 py-2 rounded bg-blue-50 hover:bg-blue-100">Home</button>
            <button onClick={() => nav("/dashboard")} className="w-full text-left px-3 py-2 rounded bg-blue-900 text-white">Dashboard</button>
            <button onClick={() => nav("/form")} className="w-full text-left px-3 py-2 rounded hover:bg-blue-100">New Application</button>
            <button onClick={() => nav("/my-documents")} className="w-full text-left px-3 py-2 rounded hover:bg-blue-100">My Documents</button>
            <button onClick={() => nav("/messages")} className="w-full text-left px-3 py-2 rounded hover:bg-blue-100">Message Center</button>
          </div>
          <button onClick={() => nav("/form")} className="mt-6 w-full bg-blue-900 text-white px-4 py-2 rounded">+ Start New Application</button>
        </aside>

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-extrabold text-blue-900">Welcome, {user.name || "Applicant"} <span>👋</span></h1>
              <p className="text-gray-500 mt-2">You have {applications.length} active applications requiring attention.</p>
            </div>
            <div className="bg-white border rounded-lg p-4 shadow">
              <input type="search" placeholder="Search applications..." className="border border-gray-300 rounded px-3 py-2 focus:outline-none" />
            </div>
          </div>

          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-900">Your Applications</h2>
              <button onClick={() => nav("/form")} className="text-blue-900 font-semibold">View all history</button>
            </div>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl border p-4 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{app.id}</p>
                    <h3 className="text-xl font-semibold text-blue-900">{app.title}</h3>
                    <p className="text-sm text-gray-600">{app.step}</p>
                    <p className="text-xs text-gray-400">Started: {app.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs ${app.status === "In Progress" ? "bg-green-100 text-green-800" : app.status === "Submitted" ? "bg-blue-100 text-blue-800" : app.status === "Draft Saved" ? "bg-amber-100 text-amber-800" : "bg-indigo-100 text-indigo-800"}`}>
                      {app.status}
                    </span>
                    <button onClick={() => nav(getContinueRoute(app))} className="mt-2 block bg-blue-900 text-white px-4 py-2 rounded">Continue</button>
                    <button onClick={() => cancelApplication(app.id)} className="mt-2 block w-full rounded border border-red-200 px-4 py-2 text-red-600">
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold">Portal Status</h3>
              <p className="mt-3 text-sm">Fast-Track</p>
              <p className="mt-2">Estimated processing: 14 days</p>
              <button onClick={() => nav("/form")} className="mt-4 bg-white text-blue-900 px-4 py-2 rounded">Finish Profile</button>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold">Need Assistance?</h3>
              <ul className="mt-3 text-gray-700 space-y-2">
                <li>Photo Requirements</li>
                <li>Supporting Documents</li>
                <li>Emergency Services</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
