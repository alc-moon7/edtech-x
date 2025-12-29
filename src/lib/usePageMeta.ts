import { useEffect } from "react";

type PageMeta = {
  title: string;
  description?: string;
};

export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const baseTitle = "HomeSchool";
    const fullTitle = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;
    document.title = fullTitle;

    const setMeta = (selector: string, content: string) => {
      const element = document.querySelector(selector);
      if (element) {
        element.setAttribute("content", content);
      }
    };

    if (description) {
      setMeta('meta[name="description"]', description);
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }

    if (title) {
      setMeta('meta[property="og:title"]', fullTitle);
      setMeta('meta[name="twitter:title"]', fullTitle);
    }

    if (typeof window !== "undefined") {
      setMeta('meta[property="og:url"]', window.location.href);
    }
  }, [title, description]);
}
