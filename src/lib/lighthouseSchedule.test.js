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
  canReturnSeat,
  scheduleLine,
  seatControls,
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

test("a warmup countdown shows seconds and opens when it runs out", () => {
  const start = Date.parse("2026-09-29T22:00:00+00:00");
  const warming = {
    phase: "pre_warm",
    countdown_to: "2026-09-29T22:00:00+00:00",
    timezone: "America/Detroit",
    drain_minutes: 10,
    current_window: {
      start: "2026-09-29T22:00:00+00:00",
      end: "2026-09-29T22:30:00+00:00",
    },
  };
  assert.match(scheduleLine(warming, start - 45000, 0), /Opens in 45s/);
  assert.match(
    scheduleLine({ ...warming, seats_taken: 0 }, start - 45000, 0),
    /engine stays off until someone takes a seat/,
  );
  const opened = scheduleLine(warming, start + 1000, 0);
  assert.match(opened, /Deep session is live/);
  assert.match(opened, /29m 59s/);
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
    /No more new seats/,
  );
  assert.match(
    scheduleLine(drain, Date.parse(drain.server_time), skew),
    /Ends in 10m/,
  );
});

test("ended and draining deactivate a new seat, and a full house stays full", () => {
  assert.deepEqual(
    seatControls({ stage: "ended", holding: false, full: false }),
    {
      disabled: true,
      label: "Session ended",
      warning: "This session has ended.",
    },
  );
  const draining = seatControls({
    stage: "drain",
    holding: false,
    full: false,
  });
  assert.equal(draining.disabled, true);
  assert.match(draining.warning, /No more new seats/);
  assert.equal(
    seatControls({ stage: "drain", holding: true, full: false }).label,
    "Seat saved",
  );
  assert.equal(
    seatControls({ stage: "open", holding: false, full: true }).label,
    "Session full",
  );
  assert.equal(
    seatControls({ stage: "pre_warm", holding: false, full: false }).disabled,
    false,
  );
  assert.equal(canReturnSeat("open"), true);
  assert.equal(canReturnSeat("pre_warm"), true);
  assert.equal(canReturnSeat("closed"), true);
  assert.equal(canReturnSeat("drain"), false);
  assert.equal(canReturnSeat("ended"), false);
  assert.equal(canReturnSeat("open", "ended"), false);
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

test("a session day stays clickable until that session has ended", () => {
  const sep28Evening = new Date("2026-09-28T22:00:00Z");
  assert.deepEqual(clickableDayNumbers(2026, 8, weekly, oneOff, sep28Evening), [
    29,
  ]);
  const sep29Morning = new Date("2026-09-29T14:00:00Z");
  assert.deepEqual(clickableDayNumbers(2026, 8, weekly, oneOff, sep29Morning), [
    29,
  ]);
  const afterClose = new Date("2026-09-30T01:00:00Z");
  assert.deepEqual(
    clickableDayNumbers(2026, 8, weekly, oneOff, afterClose),
    [],
  );
  const october = clickableDayNumbers(2026, 9, weekly, oneOff, sep29Morning);
  assert.equal(october.includes(1), true);
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

test("the timezone carousel runs east to west across US time zones", () => {
  const session = sessionInstants(2026, 8, 29, weekly, oneOff);
  assert.deepEqual(
    SESSION_TIMEZONES.map((zone) => [zone.label, zone.id]),
    [
      ["Eastern", "America/New_York"],
      ["Central", "America/Chicago"],
      ["Mountain", "America/Denver"],
      ["Pacific", "America/Los_Angeles"],
      ["Alaska", "America/Anchorage"],
      ["Hawaii", "Pacific/Honolulu"],
    ],
  );
  assert.deepEqual(
    SESSION_TIMEZONES.map((zone) =>
      formatSessionRange(session.start, session.end, zone.id),
    ),
    [
      "6:00–8:00 PM EDT",
      "5:00–7:00 PM CDT",
      "4:00–6:00 PM MDT",
      "3:00–5:00 PM PDT",
      "2:00–4:00 PM AKDT",
      "12:00–2:00 PM HST",
    ],
  );
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
