import assert from "node:assert/strict";
import test from "node:test";

import {
  clockSkewMs,
  formatWindow,
  highlightedDayNumbers,
  scheduleLine,
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
