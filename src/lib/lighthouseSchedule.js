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

export async function fetchSchedule(baseUrl) {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}api/v1/products/lighthouse/schedule`, {
    credentials: "omit",
  });
  if (!response.ok) {
    throw new Error(`Schedule request failed: ${response.status}`);
  }
  return response.json();
}
