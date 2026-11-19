import assert from "node:assert/strict";
import test from "node:test";
import {
  guideTarget,
  lessonSequence,
  placeCoach,
  guideSession,
  seatGuidance,
  takeGuideReset,
} from "./lighthouseGuide.js";

test("a live session is the scheduling path and a closed one is not", () => {
  assert.equal(seatGuidance("pre_warm"), "join");
  assert.equal(seatGuidance("open"), "join");
  assert.equal(seatGuidance("drain"), "finishing");
  assert.equal(seatGuidance("closed"), "closed");
  assert.equal(seatGuidance(undefined), "closed");
});

test("the lesson order walks the card, then the version that can analyze", () => {
  assert.deepEqual(lessonSequence("loading"), [
    "card",
    "when",
    "pills",
    "days",
  ]);
  assert.deepEqual(lessonSequence("join"), [
    "card",
    "when",
    "pills",
    "days",
    "seat",
    "upload",
    "sections",
    "analyze",
    "results",
    "byok-after",
  ]);
  assert.deepEqual(
    lessonSequence("finishing", { held: true }),
    lessonSequence("join"),
  );
  const closed = [
    "card",
    "when",
    "pills",
    "days",
    "migrate",
    "byok-switch",
    "byok-pane",
    "upload",
    "sections",
    "analyze",
    "results",
  ];
  assert.deepEqual(lessonSequence("closed"), closed);
  assert.deepEqual(lessonSequence("finishing"), closed);
});

test("guide=reset forgets a finished or dismissed walkthrough", () => {
  assert.equal(takeGuideReset("?guide=reset"), "");
  assert.equal(takeGuideReset("?guide=reset&tab=past"), "?tab=past");
  assert.equal(takeGuideReset(""), null);
  assert.equal(takeGuideReset("?guide=1"), null);
});

test("the walkthrough stays on the saved step until it is turned off", () => {
  assert.deepEqual(guideSession({ step: "byok-switch" }), {
    show: true,
    step: "byok-switch",
    route: "byok",
  });
  assert.deepEqual(guideSession({ step: "upload", route: "byok" }), {
    show: true,
    step: "upload",
    route: "byok",
  });
  assert.deepEqual(guideSession({ step: "missing" }), {
    show: true,
    step: "card",
    route: "scheduling",
  });
  assert.deepEqual(guideSession({ off: true, step: "upload", route: "byok" }), {
    show: false,
    step: "upload",
    route: "byok",
  });
  assert.deepEqual(
    guideSession({ off: true, step: "upload", route: "byok", reset: true }),
    { show: true, step: "card", route: "scheduling" },
  );
});

test("each guide step points at the live control", () => {
  assert.equal(guideTarget("card"), "calendar");
  assert.equal(guideTarget("when"), "schedule-when");
  assert.equal(guideTarget("pills"), "engine");
  assert.equal(guideTarget("days"), "schedule-days");
  assert.equal(guideTarget("migrate"), "mode");
  assert.equal(guideTarget("seat", { held: false }), "schedule-days");
  assert.equal(guideTarget("seat", { held: true }), "use-seat");
  assert.equal(guideTarget("byok-pane"), "workspace");
  assert.equal(guideTarget("upload"), "upload");
  assert.equal(guideTarget("sections"), "sections");
  assert.equal(guideTarget("analyze"), "analyze");
  assert.equal(guideTarget("results"), "results");
  assert.equal(guideTarget("byok-switch", { hasKey: false }), "connect");
  assert.equal(guideTarget("byok-switch", { hasKey: true }), "mode");
  assert.equal(guideTarget("byok-after"), "mode");
});

function overlaps(box, rect) {
  return (
    box.left < rect.right &&
    box.left + box.width > rect.left &&
    box.top < rect.bottom &&
    box.top + box.maxHeight > rect.top
  );
}

test("the lesson stays put when the highlight moves down the card", () => {
  const column = { top: 210, left: 250, right: 970, bottom: 760 };
  const shared = {
    viewport: { width: 1440, height: 900 },
    chromeBottom: 170,
    column,
    card: { height: 280 },
  };
  const high = placeCoach({
    ...shared,
    target: { top: 220, left: 270, right: 680, bottom: 300 },
  });
  const low = placeCoach({
    ...shared,
    target: { top: 560, left: 270, right: 680, bottom: 720 },
  });

  assert.equal(high.top, low.top);
  assert.equal(high.left, low.left);
  assert.equal(overlaps(high, column), false);
});

test("the lesson sits beside the calendar instead of on top of it", () => {
  const column = { top: 210, left: 250, right: 970, bottom: 760 };
  const box = placeCoach({
    viewport: { width: 1440, height: 900 },
    chromeBottom: 170,
    column,
    target: { top: 250, left: 270, right: 680, bottom: 360 },
    card: { height: 280 },
  });

  assert.equal(overlaps(box, column), false);
  assert.ok(box.left >= column.right || box.left + box.width <= column.left);
  assert.ok(box.top >= 170);
  assert.ok(box.top + box.maxHeight <= 900 - 16);
  assert.ok(box.width >= 220);
});

test("the lesson stops above the footer", () => {
  const box = placeCoach({
    viewport: { width: 1440, height: 900 },
    chromeBottom: 160,
    floor: 640,
    column: { top: 200, left: 280, right: 1000, bottom: 860 },
    target: { top: 240, left: 300, right: 700, bottom: 360 },
    card: { height: 520 },
  });
  assert.ok(box.top + box.maxHeight <= 640);
  assert.equal(
    overlaps(box, { top: 200, left: 280, right: 1000, bottom: 860 }),
    false,
  );
});

test("the lesson stays below the header when the control is in the banner", () => {
  const box = placeCoach({
    viewport: { width: 1440, height: 900 },
    chromeBottom: 188,
    column: { top: 230, left: 360, right: 1080, bottom: 820 },
    target: { top: 48, left: 40, right: 220, bottom: 84 },
    card: { height: 260 },
  });

  assert.ok(box.top >= 188);
  assert.equal(
    overlaps(box, { top: 230, left: 360, right: 1080, bottom: 820 }),
    false,
  );
});

test("a narrow screen docks the lesson along the bottom", () => {
  const box = placeCoach({
    viewport: { width: 390, height: 844 },
    chromeBottom: 220,
    floor: 820,
    column: { top: 240, left: 12, right: 378, bottom: 1100 },
    target: { top: 260, left: 16, right: 370, bottom: 900 },
    card: { height: 420 },
  });

  assert.equal(box.docked, true);
  assert.ok(box.top >= 360);
  assert.ok(box.top + box.maxHeight <= 820);
  assert.ok(box.left >= 8);
  assert.ok(box.left + box.width <= 382);
});

test("the lesson uses the other side when a dialog occupies the first gutter", () => {
  const column = { top: 200, left: 420, right: 980, bottom: 700 };
  const dialog = { top: 180, left: 1000, right: 1380, bottom: 640 };
  const box = placeCoach({
    viewport: { width: 1440, height: 900 },
    chromeBottom: 100,
    column,
    dialog,
    target: { top: 240, left: 440, right: 700, bottom: 320 },
    card: { height: 240 },
  });

  assert.equal(overlaps(box, column), false);
  assert.equal(overlaps(box, dialog), false);
  assert.ok(box.left + box.width <= column.left);
});
