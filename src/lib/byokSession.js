const tokens = { session: "", lighthouse: "" };

export function rememberCsrf(kind, token) {
  if (
    (kind === "session" || kind === "lighthouse") &&
    typeof token === "string" &&
    token
  ) {
    tokens[kind] = token;
  }
}

export function clearCsrf(kind) {
  if (kind === "session" || kind === "lighthouse") {
    tokens[kind] = "";
    return;
  }
  tokens.session = "";
  tokens.lighthouse = "";
}

export function rememberSessionStatuses(sessionStatus, lighthouseStatus) {
  if (sessionStatus) {
    if (sessionStatus.status === "active" && sessionStatus.csrf_token) {
      rememberCsrf("session", sessionStatus.csrf_token);
    } else {
      clearCsrf("session");
    }
  }
  if (lighthouseStatus) {
    if (lighthouseStatus.status === "active" && lighthouseStatus.csrf_token) {
      rememberCsrf("lighthouse", lighthouseStatus.csrf_token);
    } else {
      clearCsrf("lighthouse");
    }
  }
}

export function csrfHeaders(extra = {}) {
  const headers = { ...extra };
  if (tokens.session) headers["X-CSRF-Token"] = tokens.session;
  if (tokens.lighthouse) headers["X-Lighthouse-CSRF-Token"] = tokens.lighthouse;
  return headers;
}
