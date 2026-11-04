import assert from "node:assert/strict";
import test from "node:test";

import {
  isPublishableDetail,
  messageForNetworkFailure,
  messageForStatus,
  supportReference,
  userFacingError,
  withReference,
} from "./userError.js";

test("known provider failures stay as sentences and drop key material", () => {
  assert.equal(
    messageForStatus(401, "rejected api_key AIzaSyA1234567890123456789012"),
    "The API key was rejected. Check the key and try again.",
  );
  assert.equal(
    messageForStatus(502, "Downstream failed: sk-abcdefghijklmnopqrstuvwxyz"),
    "Something went wrong. Try again in a moment.",
  );
  assert.equal(messageForStatus(413, "PDF is too large."), "PDF is too large.");
  assert.equal(
    messageForStatus(400, "The PDF could not be read."),
    "The PDF could not be read.",
  );
  assert.equal(
    messageForStatus(
      403,
      "A team security key is required for this user test.",
    ),
    "A team security key is required for this user test.",
  );
});

test("a safe reference is appended once and junk ids are ignored", () => {
  const once = withReference("The PDF could not be read.", "abcd1234wxyz");
  assert.equal(once, "The PDF could not be read. Reference: abcd1234wxyz.");
  assert.equal(withReference(once, "abcd1234wxyz"), once);
  assert.equal(withReference("Try again.", "bad id"), "Try again.");
  assert.equal(
    supportReference({ headers: { get: () => "ok_REF-1234" } }),
    "ok_REF-1234",
  );
  assert.equal(supportReference({ headers: { get: () => "nope" } }), "");
});

test("network failures and stacks become a next step, not the raw error", () => {
  assert.equal(
    messageForNetworkFailure(new TypeError("Failed to fetch")),
    "The server could not be reached. Check your connection and try again.",
  );
  assert.equal(
    messageForNetworkFailure(new Error("The PDF could not be read.")),
    "",
  );
  assert.equal(
    userFacingError(new Error("Traceback (most recent call last):\nbombed")),
    "Something went wrong. Try again in a moment.",
  );
  assert.equal(
    userFacingError(
      new Error("The PDF could not be read. Reference: abcd1234wxyz."),
    ),
    "The PDF could not be read. Reference: abcd1234wxyz.",
  );
  assert.equal(isPublishableDetail("secret token"), false);
});
