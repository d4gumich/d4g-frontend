const WEEKDAY_INDEX = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function clockSkewMs(serverTimeIso, clientNowMs) {
  return clientNowMs - Date.parse(serverTimeIso);
}

export function formatWindow(iso, timeZone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
}

export function formatDuration(ms) {
  const minutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

export function scheduleLine(payload, clientNowMs, skewMs) {
  const serverNow = clientNowMs - skewMs;
  const remaining = formatDuration(
    Date.parse(payload.countdown_to) - serverNow,
  );
  const when = formatWindow(
    payload.countdown_to,
    payload.timezone || "America/Detroit",
  );
  if (payload.phase === "pre_warm") {
    return `Engine starting for the ${when} session. Opens in ${remaining}.`;
  }
  if (payload.phase === "open") {
    return `Deep session is live. ${remaining} left.`;
  }
  if (payload.phase === "drain") {
    return `This session is closing. Ends in ${remaining}.`;
  }
  return `Next Deep session ${when}. Starts in ${remaining}.`;
}

function weekdayInDetroit(year, monthIndex, day) {
  const probe = new Date(Date.UTC(year, monthIndex, day, 17, 0, 0));
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Detroit",
    weekday: "short",
  }).format(probe);
  return WEEKDAY_INDEX[name];
}

export function highlightedDayNumbers(year, monthIndex, weekly, oneOff) {
  const wanted = new Set(
    (weekly || []).map((item) => WEEKDAY_INDEX[item.weekday]),
  );
  const last = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const days = [];
  for (let day = 1; day <= last; day += 1) {
    if (wanted.has(weekdayInDetroit(year, monthIndex, day))) days.push(day);
  }
  for (const item of oneOff || []) {
    const [itemYear, itemMonth, itemDay] = item.date.split("-").map(Number);
    if (itemYear === year && itemMonth === monthIndex + 1) days.push(itemDay);
  }
  return [...new Set(days)].sort((a, b) => a - b);
}

export const SEAT_CAP = 30;

export const SESSION_TIMEZONES = [
  { id: "America/New_York", label: "Eastern" },
  { id: "America/Chicago", label: "Central" },
  { id: "America/Denver", label: "Mountain" },
  { id: "America/Los_Angeles", label: "Pacific" },
  { id: "America/Detroit", label: "Detroit" },
  { id: "Europe/London", label: "London" },
  { id: "UTC", label: "UTC" },
];

const SCHEDULE_ZONE = "America/Detroit";

export function detroitDate(instant) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(instant);
  const value = (type) =>
    Number(parts.find((part) => part.type === type).value);
  return {
    year: value("year"),
    monthIndex: value("month") - 1,
    day: value("day"),
  };
}

export function clickableDayNumbers(year, monthIndex, weekly, oneOff, now) {
  const instant = now instanceof Date ? now : new Date(now);
  return highlightedDayNumbers(year, monthIndex, weekly, oneOff).filter(
    (day) => {
      const session = sessionInstants(year, monthIndex, day, weekly, oneOff);
      return session !== null && session.end.getTime() > instant.getTime();
    },
  );
}

export function canGoToPreviousMonth(cursor, today) {
  return (
    cursor.year > today.year ||
    (cursor.year === today.year && cursor.monthIndex > today.monthIndex)
  );
}

function windowForDay(year, monthIndex, day, weekly, oneOff) {
  const iso = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
    day,
  ).padStart(2, "0")}`;
  const extra = (oneOff || []).find((item) => item.date === iso);
  if (extra) return { start: extra.start, end: extra.end };
  const weekday = weekdayInDetroit(year, monthIndex, day);
  const match = (weekly || []).find(
    (item) => WEEKDAY_INDEX[item.weekday] === weekday,
  );
  if (!match) return null;
  return { start: match.start, end: match.end };
}

function timeZoneOffsetMs(utcMs, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    formatter
      .formatToParts(new Date(utcMs))
      .map((part) => [part.type, part.value]),
  );
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUtc - utcMs;
}

function zonedDateTimeToUtc(year, monthIndex, day, hours, minutes, timeZone) {
  const guess = Date.UTC(year, monthIndex, day, hours, minutes);
  const corrected =
    guess -
    timeZoneOffsetMs(guess - timeZoneOffsetMs(guess, timeZone), timeZone);
  return new Date(corrected);
}

function parseClock(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return { hours, minutes };
}

export function sessionInstants(
  year,
  monthIndex,
  day,
  weekly,
  oneOff,
  timeZone = SCHEDULE_ZONE,
) {
  const window = windowForDay(year, monthIndex, day, weekly, oneOff);
  if (!window) return null;
  const startClock = parseClock(window.start);
  const endClock = parseClock(window.end);
  return {
    start: zonedDateTimeToUtc(
      year,
      monthIndex,
      day,
      startClock.hours,
      startClock.minutes,
      timeZone,
    ),
    end: zonedDateTimeToUtc(
      year,
      monthIndex,
      day,
      endClock.hours,
      endClock.minutes,
      timeZone,
    ),
    startTime: window.start,
    endTime: window.end,
  };
}

export function formatSessionRange(start, end, timeZone) {
  const clock = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  const zoneFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "short",
  });
  const zoneName = (date) =>
    zoneFormatter
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName").value;
  const startZone = zoneName(start);
  const endZone = zoneName(end);
  const startText = clock.format(start);
  const endText = clock.format(end);
  if (startZone !== endZone) {
    return `${startText} ${startZone} – ${endText} ${endZone}`;
  }
  const startMatch = startText.match(/^(.+?)\s*(AM|PM)$/);
  const endMatch = endText.match(/^(.+?)\s*(AM|PM)$/);
  if (startMatch && endMatch && startMatch[2] === endMatch[2]) {
    return `${startMatch[1]}–${endMatch[1]} ${endMatch[2]} ${startZone}`;
  }
  return `${startText} – ${endText} ${startZone}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function localStamp(year, monthIndex, day, time) {
  const { hours, minutes } = parseClock(time);
  return `${year}${pad(monthIndex + 1)}${pad(day)}T${pad(hours)}${pad(
    minutes,
  )}00`;
}

function seatDetails() {
  return `First come, first served. ${SEAT_CAP} seats.`;
}

export function sessionIcs(session) {
  const now = session.now || new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const uid = `lighthouse-${session.year}-${pad(session.monthIndex + 1)}-${pad(
    session.day,
  )}@data4good.center`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Data4Good//Lighthouse//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=America/Detroit:${localStamp(
      session.year,
      session.monthIndex,
      session.day,
      session.startTime,
    )}`,
    `DTEND;TZID=America/Detroit:${localStamp(
      session.year,
      session.monthIndex,
      session.day,
      session.endTime,
    )}`,
    "SUMMARY:Lighthouse Deep session",
    `DESCRIPTION:${seatDetails()}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function googleCalendarUrl(session) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Lighthouse Deep session",
    dates: `${localStamp(
      session.year,
      session.monthIndex,
      session.day,
      session.startTime,
    )}/${localStamp(
      session.year,
      session.monthIndex,
      session.day,
      session.endTime,
    )}`,
    ctz: SCHEDULE_ZONE,
    details: seatDetails(),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export async function fetchSchedule(baseUrl) {
  if (baseUrl == null) {
    const { HOST_URL } = await import("$lib/config.js");
    baseUrl = HOST_URL;
  }
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}api/v1/products/lighthouse/schedule`, {
    credentials: "omit",
  });
  if (!response.ok) {
    throw new Error(`Schedule request failed: ${response.status}`);
  }
  return response.json();
}
