import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VerificationSuccess from "./pages/VerificationSuccess";
import OnboardingSetup from "./pages/OnboardingSetup";
import Dashboard from "./pages/Dashboard";
import NewApplication from "./pages/NewApplication";
import PersonalInfo from "./pages/PersonalInfo";
import AddressInfo from "./pages/AddressInfo";
import DocumentUpload from "./pages/DocumentUpload";
import MyDocuments from "./pages/MyDocuments";
import MessageCenter from "./pages/MessageCenter";
import Appointment from "./pages/Appointment";
import Confirmation from "./pages/Confirmation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerificationSuccess />} />
        <Route path="/onboarding-setup" element={<OnboardingSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply" element={<NewApplication />} />
        <Route path="/form" element={<PersonalInfo />} />
        <Route path="/address" element={<AddressInfo />} />
        <Route path="/documents" element={<DocumentUpload />} />
        <Route path="/my-documents" element={<MyDocuments />} />
        <Route path="/messages" element={<MessageCenter />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/success" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  );
}
