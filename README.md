# Linguaflash Firebase API

OpenAPI documentation and automated API tests for the Linguaflash Firebase project (`linguaflash-f5591`):

- **Firebase Auth** (Identity Toolkit REST API)
- **Cloud Firestore** (REST API)

## Layout

- [`openapi.yaml`](openapi.yaml): spec, the only file to edit by hand.
- [`openapi.json`](openapi.json): generated from the spec.
- [`index.html`](index.html), [`js/app.js`](js/app.js), `vendor/swagger-ui/`: Swagger UI page.
- [`scripts/build.js`](scripts/build.js): validates the spec, regenerates `openapi.json` and the spec embedded in `index.html`.
- [`config/firebase.config.js`](config/firebase.config.js): Firebase web config.
- `tests/`: Jest tests for Auth and Firestore.
- [`vercel.json`](vercel.json): Vercel deployment config.

## Install

```bash
npm install
```

Requires Node.js 18+.

## Usage

```bash
npm run validate      # validate openapi.yaml only
npm run build         # validate + regenerate openapi.json and index.html
npm start             # serve locally on http://localhost:8080
npm test              # run all API tests
npm run test:auth     # Auth tests only
npm run test:firestore
```

After editing `openapi.yaml`, run `npm run build` before committing.

## Deployment

The repository root is a static site. Import the repo into Vercel with the default settings, then deploy. `vercel.json` sets clean URLs.

## Notes

- Tests use only invalid or non-existent credentials, so they do not create real accounts or write data.
- Firestore results depend on the project's Security Rules.
- The spec describes Firebase's public REST endpoints. It is not an official Google spec.
