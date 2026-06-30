import React from 'react';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const demoUser = {
  id: "demo-user-1",
  name: "Anshu Mat",
  email: "hire-me@anshumat.org",
  phone: "+919000000000",
};

const demoApplications = [
  {
    id: "APP-9832-X1",
    userId: "demo-user-1",
    title: "Passport Renewal",
    status: "In Progress",
    step: "Upload identity documents",
    date: "Oct 12, 2023",
  },
  {
    id: "APP-4402-QB",
    userId: "demo-user-1",
    title: "New Passport Application",
    status: "Awaiting Appointment",
    step: "Schedule appointment",
    date: "Sep 28, 2023",
  },
];

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [demoAccount, setDemoAccount] = useState({
    email: "hire-me@anshumat.org",
    password: "HireMe@2025!",
  });
  const nav = useNavigate();

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const loginWithDemoFallback = () => {
    localStorage.setItem("passport-user", JSON.stringify(demoUser));
    localStorage.setItem("passport-applications", JSON.stringify(demoApplications));
    return nav("/verify", {
      state: {
        mode: "login",
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
      },
    });
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/auth/demo-user")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch demo account");
        return res.json();
      })
      .then((data) => {
        if (data?.email && data?.password) {
          setDemoAccount({ email: data.email, password: data.password });
        }
      })
      .catch(() => {});
  }, []);

  const fillDemoCredentials = () => {
    setMode("login");
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
  };

  const handleOTP = async () => {
    if (mode === "signup") {
      if (!name) return alert("Enter your name");
      if (!email || !validateEmail(email)) return alert("Enter a valid email");
      if (!phone) return alert("Enter phone number");
      if (!password) return alert("Enter password");

      try {
        const result = await fetch("http://localhost:4000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password }),
        });

        if (!result.ok) {
          const err = await result.json();
          return alert(err.message || "Unable to signup");
        }

        const data = await result.json();
        localStorage.setItem("passport-user", JSON.stringify(data.user));
        localStorage.setItem("passport-applications", JSON.stringify(data.applications));

        return nav("/verify", { state: { mode, name, email, phone } });
      } catch (error) {
        console.error(error);
        return alert("Backend unavailable. Please start server first.");
      }
    }

    if (mode === "login") {
      if (!email || !validateEmail(email)) return alert("Enter a valid email");
      if (!password) return alert("Enter password");

      try {
        const result = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!result.ok) {
          const err = await result.json();
          return alert(err.message || "Login failed");
        }

        const data = await result.json();
        localStorage.setItem("passport-user", JSON.stringify(data.user));
        localStorage.setItem("passport-applications", JSON.stringify(data.applications));

        return nav("/verify", { state: { mode, name: data.user.name, email: data.user.email, phone: data.user.phone } });
      } catch (error) {
        console.error(error);
        const isDemoLogin =
          email.trim().toLowerCase() === demoAccount.email.trim().toLowerCase() &&
          password === demoAccount.password;

        if (isDemoLogin) {
          return loginWithDemoFallback();
        }

        return alert("Backend unavailable. Start the server with npm run start or npm run backend.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F6A] flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-blue-900">Login / Signup</h2>
        <p className="text-gray-500 mt-2">Secure access to your documents.</p>

        <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Demo Login</p>
          <p className="mt-2 text-sm text-blue-900">Email: {demoAccount.email}</p>
          <p className="text-sm text-blue-900">Password: {demoAccount.password}</p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="mt-3 rounded bg-blue-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Use Demo Credentials
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded ${mode === "login" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Existing User (Login)
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded ${mode === "signup" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            New User (Sign Up)
          </button>
        </div>

        {mode === "signup" ? (
          <>
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">NAME</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">EMAIL</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">PHONE NUMBER</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 90000 00000"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div className="mt-6">
              <label className="text-sm font-semibold text-gray-700">EMAIL</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full mt-2 p-3 bg-gray-100 rounded outline-none"
              />
            </div>
          </>
        )}

        <button
          onClick={handleOTP}
          className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg"
        >
          {mode === "login" ? "Login with OTP" : "Sign up with OTP"}
        </button>

        <p className="text-xs text-gray-500 mt-3">You will be redirected to OTP verification first.</p>
      </div>
    </div>
  );
}
