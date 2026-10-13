const REFERENCE_ID = /^[A-Za-z0-9_-]{8,64}$/;
const UNSAFE_DETAIL =
  /traceback|stack trace|\bexception\b|\bapi[_-]?key\b|authorization|\bbearer\s|\bsk-[a-z0-9]|AIza|\bhf_[a-z0-9]|\bsecret\b/i;
const LONG_TOKEN = /[A-Za-z0-9+/=_-]{32,}/;

export function isPublishableDetail(detail) {
  if (typeof detail !== "string") return false;
  const text = detail.trim();
  if (!text || text.length > 240 || text.includes("\n")) return false;
  if (UNSAFE_DETAIL.test(text) || LONG_TOKEN.test(text)) return false;
  return true;
}

export function messageForStatus(status, detail) {
  if (isPublishableDetail(detail)) return detail.trim();
  if (status === 401) {
    return "The API key was rejected. Check the key and try again.";
  }
  if (status === 403) return "This action is not allowed.";
  if (status === 409) return "That session is not available right now.";
  if (status === 413) return "The file is too large.";
  if (status === 429)
    return "Too many requests. Wait a few minutes and try again.";
  if (status === 503)
    return "The service is busy. Wait a minute and try again.";
  if (status >= 500) return "Something went wrong. Try again in a moment.";
  return "The request could not be completed. Try again.";
}

export function supportReference(response) {
  const headers = response?.headers;
  const raw = headers?.get?.("x-request-id") || "";
  const id = String(raw).trim();
  return REFERENCE_ID.test(id) ? id : "";
}

export function referenceFromBody(value) {
  const id = typeof value === "string" ? value.trim() : "";
  return REFERENCE_ID.test(id) ? id : "";
}

export function withReference(message, reference) {
  const id = typeof reference === "string" ? reference.trim() : "";
  if (!REFERENCE_ID.test(id) || message.includes(`Reference: ${id}`)) {
    return message;
  }
  return `${message} Reference: ${id}.`;
}

export function messageForNetworkFailure(err) {
  const message = typeof err?.message === "string" ? err.message : "";
  const failed =
    err?.name === "TypeError" ||
    message === "Failed to fetch" ||
    message === "Load failed" ||
    /NetworkError|ECONNREFUSED|Failed to fetch/i.test(message);
  if (!failed) return "";
  return "The server could not be reached. Check your connection and try again.";
}

export function userFacingError(err) {
  const network = messageForNetworkFailure(err);
  if (network) return network;
  const message = typeof err?.message === "string" ? err.message.trim() : "";
  const reference = message.match(/ Reference: ([A-Za-z0-9_-]{8,64})\.$/);
  const body = reference ? message.slice(0, reference.index) : message;
  if (!isPublishableDetail(body)) {
    return "Something went wrong. Try again in a moment.";
  }
  return reference ? `${body} Reference: ${reference[1]}.` : body;
}
