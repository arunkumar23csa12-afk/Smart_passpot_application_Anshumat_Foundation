import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const nav = useNavigate();
  const loggedIn = Boolean(localStorage.getItem("passport-user"));

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="font-bold text-blue-900">Passport Portal</h2>
      <div className="space-x-4 text-sm">
        <Link to="/" className="text-blue-900 font-semibold">Home</Link>
        {loggedIn && (
          <Link to="/dashboard" className="bg-blue-900 text-white px-4 py-2 rounded">
            Dashboard
          </Link>
        )}
        {!loggedIn && location.pathname !== "/login" && (
          <Link to="/login" className="bg-blue-900 text-white px-4 py-2 rounded">Login / Sign Up</Link>
        )}
        {loggedIn && (
          <button
            onClick={() => {
              localStorage.removeItem("passport-user");
              localStorage.removeItem("passport-applications");
              nav("/");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
