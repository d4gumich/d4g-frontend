export const GUIDE_DONE_KEY = "lighthouse_guide_done";
export const GUIDE_HIDE_KEY = "lighthouse_guide_hide";
export const GUIDE_OFF_KEY = "lighthouse_guide_off";
export const GUIDE_STEP_KEY = "lighthouse_guide_step";
export const GUIDE_ROUTE_KEY = "lighthouse_guide_route";

export function takeGuideReset(search) {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  if (params.get("guide") !== "reset") return null;
  params.delete("guide");
  const next = params.toString();
  return next ? `?${next}` : "";
}

const TOUR = ["card", "when", "pills", "days"];
const WORK = ["upload", "sections", "analyze", "results"];

export function seatGuidance(phase) {
  if (phase === "pre_warm" || phase === "open") return "join";
  if (phase === "drain") return "finishing";
  return "closed";
}

export function lessonSequence(guidance, { held = false } = {}) {
  if (guidance === "loading") return [...TOUR];
  if (guidance === "join" || (guidance === "finishing" && held)) {
    return [...TOUR, "seat", ...WORK, "byok-after"];
  }
  return [...TOUR, "migrate", "byok-switch", "byok-pane", ...WORK];
}

export function guideSession({
  off = false,
  step = "",
  route = "",
  reset = false,
} = {}) {
  const known = new Set([
    ...lessonSequence("join"),
    ...lessonSequence("closed"),
  ]);
  if (reset) return { show: true, step: "card", route: "scheduling" };
  const next = known.has(step) ? step : "card";
  let mode = route === "byok" ? "byok" : "scheduling";
  if (next === "byok-switch" || next === "byok-pane") mode = "byok";
  if (
    next === "card" ||
    next === "when" ||
    next === "pills" ||
    next === "days" ||
    next === "migrate" ||
    next === "seat" ||
    next === "byok-after"
  ) {
    mode = "scheduling";
  }
  return { show: !off, step: next, route: mode };
}

export function guideTarget(step, { held = false, hasKey = false } = {}) {
  switch (step) {
    case "card":
      return "calendar";
    case "when":
      return "schedule-when";
    case "pills":
      return "engine";
    case "days":
      return "schedule-days";
    case "migrate":
    case "byok-after":
      return "mode";
    case "seat":
      return held ? "use-seat" : "schedule-days";
    case "byok-pane":
      return "workspace";
    case "upload":
      return "upload";
    case "sections":
      return "sections";
    case "analyze":
      return "analyze";
    case "results":
      return "results";
    case "byok-switch":
      return hasKey ? "mode" : "connect";
    default:
      return "calendar";
  }
}

function intersects(box, rect) {
  if (!rect) return false;
  const right = box.left + box.width;
  const bottom = box.top + box.maxHeight;
  return (
    box.left < rect.right - 8 &&
    right > rect.left + 8 &&
    box.top < rect.bottom - 8 &&
    bottom > rect.top + 8
  );
}

function makeBox({ left, width, wanted, minTop, viewport, floor }) {
  const pad = 16;
  const vh = viewport.height;
  const limit = Math.min(vh - pad, floor ?? vh - pad);
  const top = minTop;
  const maxHeight = Math.max(120, Math.min(wanted, limit - top));

  return {
    top: Math.round(top),
    left: Math.round(left),
    width: Math.round(width),
    maxHeight: Math.round(maxHeight),
  };
}

/**
 * Put the lesson in the empty gutter beside the content, at a fixed height
 * under the page chrome. Next does not slide the card down to the highlight.
 * `column` is the block the lesson must not cover.
 * Rects are viewport pixels: { top, left, right, bottom }.
 */
export function placeCoach({
  viewport,
  target = null,
  column = null,
  dialog = null,
  card = {},
  chromeBottom = 0,
  floor = null,
}) {
  const pad = 16;
  const gap = 16;
  const preferred = 336;
  const minWidth = 220;
  const vw = viewport.width;
  const vh = viewport.height;
  const wanted = Math.min(Math.max(card.height ?? 420, 280), 560);
  const minTop = Math.max(pad, Math.round(chromeBottom) + 12);
  const block = column || target;
  const options = [];

  function consider(left, width, room) {
    if (width < minWidth) return;
    options.push({
      room,
      box: makeBox({
        left,
        width,
        wanted,
        minTop,
        floor,
        viewport: { width: vw, height: vh },
      }),
    });
  }

  if (block) {
    const rightRoom = vw - block.right - pad;
    const rightWidth = Math.min(preferred, rightRoom - gap);
    consider(block.right + gap, rightWidth, rightRoom);
    const leftRoom = block.left - pad;
    const leftWidth = Math.min(preferred, leftRoom - gap);
    consider(block.left - gap - leftWidth, leftWidth, leftRoom);
  }
  options.sort((a, b) => b.room - a.room);

  const obstacles = [block, dialog].filter(Boolean);
  const placed = options.find(
    (option) => !obstacles.some((rect) => intersects(option.box, rect)),
  );
  if (placed) return placed.box;

  const limit = Math.min(vh - pad, floor ?? vh - pad);
  const width = Math.min(preferred, Math.max(minWidth, vw - pad * 2));
  const cap = Math.round(Math.min(vh * 0.58, 460));
  const maxHeight = Math.min(wanted, cap, Math.max(220, limit - minTop - 96));
  const top = Math.max(minTop, limit - maxHeight);
  return {
    top: Math.round(top),
    left: Math.round(Math.max(pad, (vw - width) / 2)),
    width: Math.round(width),
    maxHeight: Math.round(maxHeight),
    docked: true,
  };
}
