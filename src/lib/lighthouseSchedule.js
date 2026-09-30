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
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0 && seconds === 0) return `${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export const SESSION_ENDED_WARNING = "This session has ended.";
export const SESSION_DRAIN_WARNING =
  "No more new seats. People who already have a seat are finishing before the server shuts down.";

export function stageClock(stepId, stage, activeStep, readyAt, nowMs) {
  if (!stage?.entered_at) return "";
  const entered = Date.parse(stage.entered_at);
  let endMs;
  if (stage.left_at) endMs = Date.parse(stage.left_at);
  else if (stepId === activeStep) endMs = nowMs;
  else if (readyAt) endMs = Date.parse(readyAt);
  else endMs = entered;
  if (Number.isNaN(entered) || Number.isNaN(endMs)) return "";
  return formatElapsed(endMs - entered);
}

export function seatControls({ stage, holding, full, claiming }) {
  if (claiming) {
    return { disabled: true, label: "Saving seat…", warning: "" };
  }
  if (stage === "ended") {
    return {
      disabled: true,
      label: "Session ended",
      warning: SESSION_ENDED_WARNING,
    };
  }
  if (stage === "drain") {
    return {
      disabled: true,
      label: holding ? "Seat saved" : "No new seats",
      warning: SESSION_DRAIN_WARNING,
    };
  }
  if (holding) return { disabled: true, label: "Seat saved", warning: "" };
  if (full) return { disabled: true, label: "Session full", warning: "" };
  return { disabled: false, label: "Take a seat", warning: "" };
}

export function livePhase(payload, clientNowMs, skewMs) {
  const phase = payload?.phase || "closed";
  if (!payload?.countdown_to) return phase;
  const serverNow = clientNowMs - skewMs;
  const target = Date.parse(payload.countdown_to);
  if (Number.isNaN(target)) return phase;
  if (phase === "pre_warm" && serverNow >= target) return "open";
  if (phase === "open") {
    const drainMinutes = Number(payload.drain_minutes) || 0;
    if (serverNow >= target) return "closed";
    if (drainMinutes > 0 && serverNow >= target - drainMinutes * 60000)
      return "drain";
    return "open";
  }
  if (phase === "drain" && serverNow >= target) return "closed";
  if (phase === "closed" && serverNow >= target) return "open";
  return phase;
}

export function scheduleLine(payload, clientNowMs, skewMs) {
  const serverNow = clientNowMs - skewMs;
  const phase = livePhase(payload, clientNowMs, skewMs);
  let target = Date.parse(payload.countdown_to);
  if (phase !== payload.phase) {
    const end = payload.current_window?.end || payload.upcoming?.[0]?.end;
    if (end) target = Date.parse(end);
  }
  const remaining = formatDuration(target - serverNow);
  const when = formatWindow(
    phase === payload.phase
      ? payload.countdown_to
      : new Date(target).toISOString(),
    payload.timezone || "America/Detroit",
  );
  if (phase === "pre_warm") {
    return `Engine starting for the ${when} session. Opens in ${remaining}.`;
  }
  if (phase === "open") {
    return `Deep session is live. ${remaining} left.`;
  }
  if (phase === "drain") {
    return `${SESSION_DRAIN_WARNING} Ends in ${remaining}.`;
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
  { id: "America/Anchorage", label: "Alaska" },
  { id: "Pacific/Honolulu", label: "Hawaii" },
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

export function sessionDateKey(year, monthIndex, day) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
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

export const SEAT_TOKEN_KEY = "lighthouse_seat_token";
export const HELD_SEATS_KEY = "lighthouse_seats_held";

export class TesterKeyRequired extends Error {
  constructor() {
    super("A team security key is required for this user test.");
    this.name = "TesterKeyRequired";
  }
}

async function scheduleBase(baseUrl) {
  if (baseUrl == null) {
    const { HOST_URL } = await import("$lib/config.js");
    baseUrl = HOST_URL;
  }
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

export async function scheduledTesterActive(baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(`${base}api/v1/auth/lighthouse-status`, {
    credentials: "include",
  });
  if (!response.ok) return false;
  const body = await response.json();
  return body.status === "active";
}

export async function fetchSchedule(baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(`${base}api/v1/products/lighthouse/schedule`, {
    credentials: "omit",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Schedule request failed: ${response.status}`);
  }
  return response.json();
}

export async function claimSeat(token, sessionDate, baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/seats`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, session: sessionDate }),
    },
  );
  if (response.status === 403) throw new TesterKeyRequired();
  if (!response.ok) {
    let detail = "";
    try {
      detail = (await response.json()).detail;
    } catch {
      detail = "";
    }
    throw new Error(
      typeof detail === "string" && detail
        ? detail
        : `Seat request failed: ${response.status}`,
    );
  }
  return response.json();
}

export async function fetchEngineStatus(baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/engine`,
    { credentials: "omit", cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Engine status request failed: ${response.status}`);
  }
  return response.json();
}

export async function setDevSchedule(preset, sessionDate, baseUrl) {
  const base = await scheduleBase(baseUrl);
  const body = { preset };
  if (sessionDate) body.session = sessionDate;
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/dev`,
    {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error(`Dev schedule request failed: ${response.status}`);
  }
  return response.json();
}
