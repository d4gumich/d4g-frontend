import {
  SESSION_DRAIN_WARNING,
  SESSION_ENDED_WARNING,
  TesterKeyRequired,
} from "$lib/lighthouseSchedule.js";

export const PRACTICE_UNAVAILABLE =
  "This test page is not available. Check the team key, then confirm practice mode is on for this server.";

const OPEN_ARMED =
  "Open now is armed. The session clock and the GPU stay off until someone takes a seat.";
const OPEN_REQUESTED =
  "Open now requested the GPU. The startup timer runs until Hugging Face says it is ready. Another practice button stops it.";

async function seatHeaders() {
  const { csrfHeaders } = await import("$lib/byokSession.js");
  return csrfHeaders({ "Content-Type": "application/json" });
}

async function scheduleBase(baseUrl) {
  if (baseUrl == null) {
    const { HOST_URL } = await import("$lib/config.js");
    baseUrl = HOST_URL;
  }
  return baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
}

async function readDetail(response) {
  try {
    return (await response.json()).detail;
  } catch {
    return "";
  }
}

function practiceError(response, detail, fallback) {
  if (response.status === 404) {
    const error = new Error(PRACTICE_UNAVAILABLE);
    error.status = 404;
    return error;
  }
  if (response.status === 403 && String(detail).includes("security key")) {
    return new TesterKeyRequired();
  }
  return new Error(typeof detail === "string" && detail ? detail : fallback);
}

export async function fetchPracticeSchedule(baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/dev`,
    {
      credentials: "include",
      cache: "no-store",
      headers: await seatHeaders(),
    },
  );
  if (!response.ok) {
    throw practiceError(
      response,
      await readDetail(response),
      `Practice schedule request failed: ${response.status}`,
    );
  }
  return response.json();
}

export async function fetchPracticeEngine(baseUrl) {
  const base = await scheduleBase(baseUrl);
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/dev/engine`,
    {
      credentials: "include",
      cache: "no-store",
      headers: await seatHeaders(),
    },
  );
  if (!response.ok) {
    throw practiceError(
      response,
      await readDetail(response),
      `Practice engine request failed: ${response.status}`,
    );
  }
  return response.json();
}

const POPUP_PRESETS = new Set([
  "soon",
  "open",
  "drain",
  "ended",
  "fill_seats",
  "fast_forward",
]);

export async function applyPracticePreset(preset, session) {
  const next = await setDevSchedule(
    preset,
    preset === "fill_seats" ? session : undefined,
  );
  return {
    payload: next,
    notice: practiceNotice(preset, next),
    releaseSeats: preset === "reset_seats",
    clearSelection: preset === "clear",
    showDate: preset === "fill_seats" ? session : next.dev_date,
    openPopup: POPUP_PRESETS.has(preset),
  };
}

export function showSkip(payload, stage) {
  return (
    payload?.dev_preset === "soon" &&
    (stage === "pre_warm" || stage === "upcoming")
  );
}

export async function setDevSchedule(preset, sessionDate, baseUrl) {
  const base = await scheduleBase(baseUrl);
  const body = { preset };
  if (sessionDate) body.session = sessionDate;
  const response = await fetch(
    `${base}api/v1/products/lighthouse/schedule/dev`,
    {
      method: "POST",
      credentials: "include",
      headers: await seatHeaders(),
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw practiceError(
      response,
      await readDetail(response),
      `Dev schedule request failed: ${response.status}`,
    );
  }
  return response.json();
}

export function practiceNotice(preset, next) {
  if (preset === "seat_taken") return OPEN_REQUESTED;
  if (preset === "seat_left") return OPEN_ARMED;
  if (preset === "open") {
    const taken = Number(
      next?.seats?.[next.dev_date] ?? next?.seats_taken ?? 0,
    );
    return taken >= 1 ? OPEN_REQUESTED : OPEN_ARMED;
  }
  if (preset === "soon") {
    return "Session starts in 10 minutes. Fast forward skips that wait. The GPU stays off.";
  }
  if (preset === "fast_forward") {
    return "Skipped the wait. The session is open. The GPU stays off.";
  }
  if (preset === "drain") return SESSION_DRAIN_WARNING;
  if (preset === "ended") return `${SESSION_ENDED_WARNING} Take a seat is off.`;
  if (preset === "clear") return "Real Tuesday and Thursday calendar is on.";
  if (preset === "reset_seats") {
    return "Seats reset. Open a session, then take a seat.";
  }
  if (preset === "fill_seats") {
    return next?.dev_preset === "open"
      ? "All 30 seats are filled. The GPU starts because someone has a seat."
      : "All 30 seats are filled. Take a seat stays off until you reset seats.";
  }
  return "";
}
