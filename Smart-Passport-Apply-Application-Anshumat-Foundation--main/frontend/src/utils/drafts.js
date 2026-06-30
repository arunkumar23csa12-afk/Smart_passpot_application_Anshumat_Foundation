import { getData, saveData } from "./storage";

const DRAFT_APP_ID_KEY = "current-draft-application-id";

const mergeApplicationIntoCache = (application) => {
  const existing = getData("passport-applications");
  const currentList = Array.isArray(existing) ? existing : [];
  const nextList = [application, ...currentList.filter((item) => item.id !== application.id)];
  saveData("passport-applications", nextList);
  return nextList;
};

export const saveDraftApplication = async ({ user, title = "New Passport Application", step, route }) => {
  if (!user?.email) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const existingDraftId = getData(DRAFT_APP_ID_KEY);

  const payload = {
    email: user.email,
    title,
    status: "Draft Saved",
    step,
    date: currentDate,
    route,
  };

  try {
    let application;

    if (existingDraftId) {
      const response = await fetch(`http://localhost:4000/api/applications/${existingDraftId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Draft update failed");
      const data = await response.json();
      application = data.application;
    } else {
      const response = await fetch("http://localhost:4000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Draft create failed");
      const data = await response.json();
      application = data.application;
      saveData(DRAFT_APP_ID_KEY, application.id);
    }

    mergeApplicationIntoCache(application);
    return application;
  } catch {
    const fallbackId = existingDraftId || `APP-DRAFT-${Date.now()}`;
    const fallbackApplication = {
      id: fallbackId,
      title,
      status: "Draft Saved",
      step,
      date: currentDate,
      route,
    };

    saveData(DRAFT_APP_ID_KEY, fallbackId);
    mergeApplicationIntoCache(fallbackApplication);
    return fallbackApplication;
  }
};

export const clearCurrentDraftApplication = () => {
  saveData(DRAFT_APP_ID_KEY, null);
};
