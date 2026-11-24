const config = require("../config/firebase.config");

// Firebase Identity Toolkit REST API (Auth)
const AUTH_BASE = "https://identitytoolkit.googleapis.com/v1";
const key = config.apiKey;

async function post(path, body) {
  const res = await fetch(`${AUTH_BASE}${path}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

describe("Firebase Auth REST API - Linguaflash", () => {
  test("config has all required fields", () => {
    for (const f of ["apiKey", "authDomain", "projectId", "appId", "messagingSenderId"]) {
      expect(config[f]).toBeTruthy();
    }
    expect(config.authDomain).toBe(`${config.projectId}.firebaseapp.com`);
  });

  test("signInWithPassword rejects unknown email (EMAIL_NOT_FOUND)", async () => {
    const { status, data } = await post("/accounts:signInWithPassword", {
      email: `nonexistent-${Date.now()}@example.com`,
      password: "WrongPassword123!",
      returnSecureToken: true,
    });
    expect(status).toBe(400);
    expect(data.error.message).toMatch(/EMAIL_NOT_FOUND|INVALID_LOGIN_CREDENTIALS/);
  });

  test("signInWithPassword rejects missing password (MISSING_PASSWORD)", async () => {
    const { status, data } = await post("/accounts:signInWithPassword", {
      email: "test@example.com",
      returnSecureToken: true,
    });
    expect(status).toBe(400);
    expect(data.error.message).toBe("MISSING_PASSWORD");
  });

  test("signUp rejects invalid email format (INVALID_EMAIL)", async () => {
    const { status, data } = await post("/accounts:signUp", {
      email: "not-an-email",
      password: "Password123!",
      returnSecureToken: true,
    });
    expect(status).toBe(400);
    expect(data.error.message).toBe("INVALID_EMAIL");
  });

  test("signUp rejects weak password (WEAK_PASSWORD)", async () => {
    const { status, data } = await post("/accounts:signUp", {
      email: `weak-${Date.now()}@example.com`,
      password: "123",
      returnSecureToken: true,
    });
    expect(status).toBe(400);
    expect(data.error.message).toMatch(/WEAK_PASSWORD/);
  });

  test("request with invalid API key is rejected", async () => {
    const res = await fetch(`${AUTH_BASE}/accounts:signInWithPassword?key=INVALID_KEY`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "a@b.com", password: "x", returnSecureToken: true }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error.message).toMatch(/API key not valid/);
  });
});
