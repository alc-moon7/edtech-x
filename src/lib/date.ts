"use client";

const TIME_ZONE = "Asia/Dhaka";
const DATE_PARTS = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

type DateParts = {
  year: string;
  month: string;
  day: string;
};

function getDateParts(date: Date): DateParts {
  const parts = DATE_PARTS.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "0000";
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return { year, month, day };
}

export function formatDateKey(date: Date) {
  const { year, month, day } = getDateParts(date);
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (!year || !month || !day) {
    return new Date(dateKey);
  }
  return new Date(Date.UTC(year, month - 1, day));
}

export function getBangladeshToday() {
  return parseDateKey(formatDateKey(new Date()));
}
