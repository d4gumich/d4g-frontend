import assert from "node:assert/strict";
import test from "node:test";

import {
  SEAT_CAP,
  SESSION_TIMEZONES,
  canGoToPreviousMonth,
  clickableDayNumbers,
  clockSkewMs,
  detroitDate,
  formatSessionRange,
  formatWindow,
  googleCalendarUrl,
  highlightedDayNumbers,
  recentPastSessions,
  scheduleLine,
  sessionIcs,
  sessionInstants,
} from "./lighthouseSchedule.js";

const payload = {
  server_time: "2026-01-05T17:00:00+00:00",
  timezone: "America/Detroit",
  phase: "closed",
  countdown_to: "2026-01-06T23:00:00+00:00",
  upcoming: [
    { start: "2026-01-06T23:00:00+00:00", end: "2026-01-07T01:00:00+00:00" },
  ],
  weekly: [
    { weekday: "Tue", start: "18:00", end: "20:00" },
    { weekday: "Thu", start: "18:00", end: "20:00" },
  ],
  one_off: [{ date: "2026-10-16", start: "18:00", end: "20:00" }],
};

test("skew corrects a fast client clock", () => {
  const clientNow = Date.parse("2026-01-05T17:05:00+00:00");
  const skew = clockSkewMs(payload.server_time, clientNow);
  assert.equal(skew, 5 * 60 * 1000);
  const line = scheduleLine(payload, clientNow, skew);
  assert.match(line, /Next Deep session/);
  assert.match(line, /1d 6h/);
});

test("open and drain copy uses the time left", () => {
  const open = {
    ...payload,
    phase: "open",
    server_time: "2026-01-06T23:30:00+00:00",
    countdown_to: "2026-01-07T01:00:00+00:00",
  };
  const skew = 0;
  assert.match(
    scheduleLine(open, Date.parse(open.server_time), skew),
    /Deep session is live/,
  );
  assert.match(
    scheduleLine(open, Date.parse(open.server_time), skew),
    /1h 30m/,
  );
  const drain = {
    ...open,
    phase: "drain",
    server_time: "2026-01-07T00:50:00+00:00",
  };
  assert.match(
    scheduleLine(drain, Date.parse(drain.server_time), skew),
    /closing/,
  );
});

test("detroit formatting is 6:00 PM EST in January", () => {
  assert.equal(
    formatWindow("2026-01-06T23:00:00+00:00", "America/Detroit"),
    "Tue, Jan 6, 6:00 PM EST",
  );
});

test("september 2026 highlights tuesdays and thursdays, and a friday one-off stays in october", () => {
  const september = highlightedDayNumbers(
    2026,
    8,
    payload.weekly,
    payload.one_off,
  );
  assert.deepEqual(september, [1, 3, 8, 10, 15, 17, 22, 24, 29]);
  const october = highlightedDayNumbers(
    2026,
    9,
    payload.weekly,
    payload.one_off,
  );
  assert.equal(october.includes(1), true);
  assert.equal(october.includes(16), true);
  assert.equal(september.includes(16), false);
});

const weekly = payload.weekly;
const oneOff = payload.one_off;

test("only schedule dates after today in Detroit are clickable", () => {
  const sep28 = { year: 2026, monthIndex: 8, day: 28 };
  assert.deepEqual(clickableDayNumbers(2026, 8, weekly, oneOff, sep28), [29]);
  const sep29 = { year: 2026, monthIndex: 8, day: 29 };
  assert.deepEqual(clickableDayNumbers(2026, 8, weekly, oneOff, sep29), []);
  const october = clickableDayNumbers(2026, 9, weekly, oneOff, sep29);
  assert.equal(october.includes(1), true);
  assert.equal(october.includes(15), true);
  assert.equal(october.includes(16), true);
  assert.equal(october.includes(2), false);
});

test("the month control cannot move before the current Detroit month", () => {
  const today = { year: 2026, monthIndex: 8, day: 29 };
  assert.equal(
    canGoToPreviousMonth({ year: 2026, monthIndex: 8 }, today),
    false,
  );
  assert.equal(
    canGoToPreviousMonth({ year: 2026, monthIndex: 9 }, today),
    true,
  );
});

test("a Detroit evening session is 10pm UTC in September and 11pm UTC in November", () => {
  const september = sessionInstants(2026, 8, 29, weekly, oneOff);
  assert.equal(september.start.toISOString(), "2026-09-29T22:00:00.000Z");
  assert.equal(september.end.toISOString(), "2026-09-30T00:00:00.000Z");
  const november = sessionInstants(2026, 10, 3, weekly, oneOff);
  assert.equal(november.start.toISOString(), "2026-11-03T23:00:00.000Z");
});

test("the timezone carousel shows the same session in Central and London", () => {
  const session = sessionInstants(2026, 8, 29, weekly, oneOff);
  assert.equal(
    formatSessionRange(session.start, session.end, "America/Chicago"),
    "5:00–7:00 PM CDT",
  );
  assert.equal(
    formatSessionRange(session.start, session.end, "Europe/London"),
    "11:00 PM – 1:00 AM GMT+1",
  );
  assert.equal(
    SESSION_TIMEZONES.some((zone) => zone.id === "America/Detroit"),
    true,
  );
});

test("past sessions are the schedule dates before today, newest first", () => {
  const past = recentPastSessions(
    weekly,
    oneOff,
    { year: 2026, monthIndex: 8, day: 29 },
    3,
  );
  assert.deepEqual(
    past.map((item) => item.day),
    [24, 22, 17],
  );
  assert.equal(past[0].monthIndex, 8);
});

test("calendar exports use Detroit local time and name the 30 seat cap", () => {
  const session = {
    year: 2026,
    monthIndex: 8,
    day: 29,
    startTime: "18:00",
    endTime: "20:00",
    now: new Date("2026-09-28T15:00:00Z"),
  };
  const ics = sessionIcs(session);
  assert.match(ics, /DTSTART;TZID=America\/Detroit:20260929T180000/);
  assert.match(ics, /DTEND;TZID=America\/Detroit:20260929T200000/);
  assert.match(ics, new RegExp(`${SEAT_CAP} seats`));
  const url = googleCalendarUrl(session);
  assert.match(url, /calendar\.google\.com/);
  assert.match(url, /ctz=America%2FDetroit/);
  assert.match(url, /20260929T180000%2F20260929T200000/);
  assert.match(url, /30\+seats|30%20seats/);
});

test("detroitDate reads the Detroit calendar day", () => {
  assert.deepEqual(detroitDate(new Date("2026-09-29T03:30:00Z")), {
    year: 2026,
    monthIndex: 8,
    day: 28,
  });
});
