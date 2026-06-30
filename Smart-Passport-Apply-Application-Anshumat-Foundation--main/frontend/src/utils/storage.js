export const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${key}-meta`, JSON.stringify({ savedAt: new Date().toISOString() }));
  } catch {}
};

export const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const getSavedMeta = (key) => {
  try {
    const data = localStorage.getItem(`${key}-meta`);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const formatSavedTime = (value) => {
  if (!value) return "";

  try {
    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};
