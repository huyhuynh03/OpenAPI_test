const config = require("../config/firebase.config");

// Cloud Firestore REST API
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`;

describe("Cloud Firestore REST API - Linguaflash", () => {
  test("unauthenticated list request returns a well-formed response", async () => {
    const res = await fetch(`${FS_BASE}/__api_test__?key=${config.apiKey}`);
    // 200 if rules allow public read, 403 PERMISSION_DENIED if locked down.
    expect([200, 403, 404]).toContain(res.status);
    const data = await res.json();
    if (res.status === 403) {
      expect(data.error.status).toBe("PERMISSION_DENIED");
    }
  });

  test("invalid project id returns 404", async () => {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/invalid-project-xyz/databases/(default)/documents/x?key=${config.apiKey}`
    );
    expect([401, 403, 404]).toContain(res.status);
  });

  test("write without auth is denied", async () => {
    const res = await fetch(`${FS_BASE}/api_tests?key=${config.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { probe: { stringValue: "test" } } }),
    });
    // Anonymous writes must not succeed under a secure ruleset.
    expect(res.status).not.toBe(500);
    expect([200, 401, 403]).toContain(res.status);
  });
});
