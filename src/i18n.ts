const STORAGE_KEY = "homeschool_lang";

if (typeof window !== "undefined") {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if ((stored === "en" || stored === "bn") && document?.documentElement) {
    document.documentElement.lang = stored;
  }
}

export {};
