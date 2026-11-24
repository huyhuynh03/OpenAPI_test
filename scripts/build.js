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
const swaggerUiPath = path.join(root, "node_modules", "swagger-ui-dist");
const vendorPath = path.join(root, "vendor", "swagger-ui");
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
  const blockRe =
    /(<script\s+id=["']openapi-spec["']\s+type=["']application\/json["']\s*>)[\s\S]*?(<\/script>)/i;
  if (!blockRe.test(html)) {
    throw new Error('index.html is missing <script id="openapi-spec"> block');
  }
  const eol = html.includes("\r\n") ? "\r\n" : "\n";
  const embedded = json.replace(/\n/g, eol);
  const updated = html.replace(blockRe, (_, open, close) => open + eol + embedded + close);
  if (updated === html) {
    console.log("index.html already up to date");
  } else {
    fs.writeFileSync(htmlPath, updated);
    console.log("Updated embedded spec in index.html");
  }

  // index.html loads Swagger UI from vendor/swagger-ui/. The assets are generated
  // from the swagger-ui-dist dependency so they are available on Vercel without
  // committing large vendor files.
  if (!fs.existsSync(swaggerUiPath)) {
    throw new Error(
      "swagger-ui-dist not found. Run npm install before building.",
    );
  }
  fs.rmSync(vendorPath, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(vendorPath), { recursive: true });
  fs.cpSync(swaggerUiPath, vendorPath, { recursive: true });
  console.log("Copied Swagger UI assets to vendor/swagger-ui");
}

main().catch((err) => {
  console.error("Build failed:", err.message);
  process.exit(1);
});
