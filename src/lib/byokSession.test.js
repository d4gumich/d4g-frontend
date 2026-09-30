import assert from "node:assert/strict";
import test from "node:test";

import {
  clearCsrf,
  csrfHeaders,
  rememberCsrf,
  rememberSessionStatuses,
} from "./byokSession.js";

test("csrf headers stay empty until a token is remembered", () => {
  clearCsrf();
  assert.deepEqual(csrfHeaders({ "Content-Type": "application/json" }), {
    "Content-Type": "application/json",
  });
});

test("remembered tokens are sent on later requests and can be cleared", () => {
  clearCsrf();
  rememberCsrf("session", "session-token");
  rememberCsrf("lighthouse", "lighthouse-token");
  assert.equal(csrfHeaders()["X-CSRF-Token"], "session-token");
  assert.equal(csrfHeaders()["X-Lighthouse-CSRF-Token"], "lighthouse-token");
  clearCsrf("session");
  assert.equal(csrfHeaders()["X-CSRF-Token"], undefined);
  assert.equal(csrfHeaders()["X-Lighthouse-CSRF-Token"], "lighthouse-token");
  clearCsrf();
});

test("status responses keep both session tokens in sync", () => {
  clearCsrf();
  rememberSessionStatuses(
    { status: "inactive" },
    { status: "active", csrf_token: "lighthouse-token" },
  );
  assert.equal(csrfHeaders()["X-CSRF-Token"], undefined);
  assert.equal(csrfHeaders()["X-Lighthouse-CSRF-Token"], "lighthouse-token");
  rememberSessionStatuses(
    { status: "active", csrf_token: "session-token" },
    { status: "inactive" },
  );
  assert.equal(csrfHeaders()["X-CSRF-Token"], "session-token");
  assert.equal(csrfHeaders()["X-Lighthouse-CSRF-Token"], undefined);
  clearCsrf();
});
