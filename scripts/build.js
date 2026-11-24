#!/usr/bin/env node
// Validates openapi.yaml and generates openapi.json and the embedded spec in index.html.
// Usage:
//   node scripts/build.js              validate + generate
//   node scripts/build.js --validate   validate only
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const SwaggerParser = require("@apidevtools/swagger-parser");

const root = path.join(__dirname, "..");
const specPath = path.join(root, "openapi.yaml");
const jsonPath = path.join(root, "openapi.json");
const htmlPath = path.join(root, "index.html");
const validateOnly = process.argv.includes("--validate");

async function main() {
  const raw = fs.readFileSync(specPath, "utf8");
  const spec = yaml.load(raw);

  await SwaggerParser.validate(JSON.parse(JSON.stringify(spec)));
  console.log("openapi.yaml is valid OpenAPI 3.0.");

  if (validateOnly) return;

  const json = JSON.stringify(spec, null, 2) + "\n";
  fs.writeFileSync(jsonPath, json);
  console.log("Wrote openapi.json");

  const html = fs.readFileSync(htmlPath, "utf8");
  const updated = html.replace(
    /(<script id="openapi-spec" type="application\/json">)[\s\S]*?(<\/script>)/,
    (_, open, close) => open + "\n" + json + close
  );
  if (updated === html) {
    throw new Error('index.html is missing <script id="openapi-spec"> block');
  }
  fs.writeFileSync(htmlPath, updated);
  console.log("Updated embedded spec in index.html");
}

main().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
