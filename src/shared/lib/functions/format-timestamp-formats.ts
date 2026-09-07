type TimestampParts = {
  month: string;
  day: string;
  year: string;
  time: string;
};

function getTimestampParts(date: Date, timeZone?: string): TimestampParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone,
  });

  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    month: get("month"),
    day: get("day"),
    year: get("year"),
    time: `${get("hour")}:${get("minute")}:${get("second")} ${get("dayPeriod")}`,
  };
}

function formatDisplay(parts: TimestampParts): string {
  return `${parts.month}-${parts.day}-${parts.year} ${parts.time}`;
}

function getTimezoneOffsetLabel(date: Date): string {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }

  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

export function formatUtcTimestamp(date: Date): string {
  return `${formatDisplay(getTimestampParts(date, "UTC"))} +UTC`;
}

export function formatLocalTimestamp(date: Date): string {
  return `${formatDisplay(getTimestampParts(date))} ${getTimezoneOffsetLabel(date)}`;
}

export function formatUnixTimestamp(date: Date): string {
  return Math.floor(date.getTime() / 1000).toString();
}

export function getTimestampFormats(iso: string | Date) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    utc: formatUtcTimestamp(date),
    local: formatLocalTimestamp(date),
    unix: formatUnixTimestamp(date),
  };
}
