import { writable } from "svelte/store";
import { claimSeat, clockSkewMs, fetchSchedule } from "./lighthouseSchedule.js";

const HELD_KEY = "lighthouse_seats_held";
const SEAT_TOKEN_KEY = "lighthouse_seat_token";

function readHeld() {
  if (typeof sessionStorage === "undefined") return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(HELD_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function rememberHeld(held) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(HELD_KEY, JSON.stringify(held));
}

export function seatToken() {
  if (typeof sessionStorage === "undefined") return "";
  let token = sessionStorage.getItem(SEAT_TOKEN_KEY);
  if (!token) {
    token = crypto.randomUUID();
    sessionStorage.setItem(SEAT_TOKEN_KEY, token);
  }
  return token;
}

export const scheduleState = writable({
  payload: null,
  failed: false,
  skew: 0,
  held: readHeld(),
  now: Date.now(),
});

export async function refreshSchedule() {
  try {
    const next = await fetchSchedule();
    scheduleState.update((state) => ({
      ...state,
      payload: next,
      failed: false,
      skew: clockSkewMs(next.server_time, Date.now()),
      now: Date.now(),
    }));
  } catch {
    scheduleState.update((state) => ({
      ...state,
      failed: true,
      now: Date.now(),
    }));
  }
}

export async function saveSeat(date) {
  const result = await claimSeat(seatToken(), date);
  scheduleState.update((state) => {
    const held =
      result.accepted && !state.held.includes(date)
        ? [...state.held, date]
        : state.held;
    rememberHeld(held);
    return {
      ...state,
      held,
      payload: {
        ...state.payload,
        seat_cap: result.seat_cap,
        seats: { ...(state.payload?.seats || {}), [date]: result.seats_taken },
      },
    };
  });
  return result;
}

let watch = null;

export function watchSchedule() {
  refreshSchedule();
  if (watch) return () => {};
  const tick = setInterval(() => {
    scheduleState.update((state) => ({ ...state, now: Date.now() }));
  }, 30000);
  const poll = setInterval(refreshSchedule, 60000);
  watch = { tick, poll };
  return () => {
    clearInterval(tick);
    clearInterval(poll);
    watch = null;
  };
}
