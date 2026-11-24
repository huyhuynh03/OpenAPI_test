# Linguaflash Firebase API Tests

Automated API tests for the Linguaflash Firebase project (`linguaflash-f5591`), covering:

- **Firebase Auth** (Identity Toolkit REST API): `tests/auth.test.js`
- **Cloud Firestore** (REST API): `tests/firestore.test.js`

Config lives in [config/firebase.config.js](config/firebase.config.js).

## Install

```bash
npm install
```

Requires Node.js 18+ (uses the global `fetch`).

## Run

```bash
npm test               # all tests
npm run test:auth      # auth only
npm run test:firestore # firestore only
```

## Notes

- Tests use only invalid or non-existent credentials, so they do not create real accounts or write data.
- Results depend on the project's Auth and Security Rules settings.
