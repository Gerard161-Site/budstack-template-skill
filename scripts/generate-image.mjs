#!/usr/bin/env node
/**
 * Generates one photograph for a template through the Higgsfield developer
 * API (docs.higgsfield.ai), for a design handoff that describes its images
 * but does not supply them. No dependencies.
 *
 * Credentials: a key ID and a key secret from console.higgsfield.ai, read from
 * the environment or from export lines in ~/.zshrc, and never printed:
 *   export HF_API_KEY_ID="..."
 *   export HF_API_KEY_SECRET="..."
 *
 *   node scripts/generate-image.mjs check
 *   node scripts/generate-image.mjs estimate <aspect_ratio> <resolution>
 *   node scripts/generate-image.mjs generate <out-file-without-extension> <aspect_ratio> <resolution> "<prompt>"
 *
 * aspect_ratio: 9:16 16:9 4:3 3:4 1:1 2:3 3:2   resolution: 720p 1080p
 * The result is a PNG (about 2048px on the long side at 1080p). Convert it to
 * a JPEG at the size the slot needs before it goes into assets/, for example:
 *   sips -Z 1200 -s format jpeg -s formatOptions 85 in.png --out assets/card.jpg
 */
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const API = "https://api.higgsfield.ai";
const MODEL = "higgsfield-ai/soul/v2/standard";
const PAIR_NAMES = ["HF_CREDENTIALS", "HF_KEY", "HIGGSFIELD_API_KEY", "HIGGSFIELD_CREDENTIALS"];
const ID_NAMES = ["HF_API_KEY_ID", "HIGGSFIELD_API_KEY_ID", "HIGGSFIELD_KEY_ID", "HIGGSFIELD_API_KEY"];
const SECRET_NAMES = ["HF_API_KEY_SECRET", "HIGGSFIELD_API_KEY_SECRET", "HIGGSFIELD_API_SECRET", "HIGGSFIELD_SECRET"];
const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"]);

function fail(message) {
  console.error(`[generate-image] ${message}`);
  process.exit(1);
}

/** Variables exported in ~/.zshrc, for a session started before they were added. */
function profileVariables() {
  const found = {};
  for (const name of [".zshrc", ".zprofile", ".zshenv"]) {
    const file = join(homedir(), name);
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf-8").split("\n")) {
      const match = line.match(/^\s*export\s+([A-Z][A-Z0-9_]*)=(.*)$/);
      if (match) found[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return found;
}

function credentials() {
  const variables = { ...profileVariables(), ...process.env };
  const first = (names) => names.map((name) => variables[name]).find((value) => value);
  const id = first(ID_NAMES);
  const secret = first(SECRET_NAMES);
  if (id && secret && !id.includes(":")) return { pair: `${id}:${secret}`, source: "key id + secret" };
  const pair = PAIR_NAMES.map((name) => variables[name]).find((value) => value && value.includes(":"));
  if (pair) return { pair, source: "id:secret pair" };
  return { pair: null, haveId: Boolean(id), haveSecret: Boolean(secret) };
}

async function call(path, { method = "GET", body, pair }) {
  const response = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Key ${pair}`,
      ...(body ? { "Content-Type": "application/json", "Idempotency-Key": randomUUID() } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // Not JSON: the status line below is the evidence.
  }
  return { status: response.status, json, text: text.slice(0, 300) };
}

function extensionFor(bytes, contentType) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50) return "png";
  if (bytes.slice(8, 12).toString("latin1") === "WEBP") return "webp";
  return (contentType || "").split("/")[1] || "bin";
}

async function generate(pair, outBase, aspectRatio, resolution, prompt) {
  const created = await call(`/${MODEL}`, {
    method: "POST",
    pair,
    body: { prompt, aspect_ratio: aspectRatio, resolution, batch_size: 1 },
  });
  if (created.status >= 300 || !created.json?.request_id) fail(`create answered ${created.status}: ${created.text}`);

  const id = created.json.request_id;
  let delay = 2000;
  for (let waited = 0; waited < 300_000; waited += delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    delay = Math.min(delay + 1000, 10_000);
    const status = await call(`/requests/${id}/status`, { pair });
    const state = status.json?.status;
    if (!TERMINAL.has(state)) continue;
    if (state !== "completed") fail(`request ended as "${state}": ${status.text}`);

    const url = status.json.images?.[0]?.url;
    if (!url) fail(`completed with no image url: ${status.text}`);
    const image = await fetch(url);
    const bytes = Buffer.from(await image.arrayBuffer());
    const file = `${outBase}.${extensionFor(bytes, image.headers.get("content-type"))}`;
    writeFileSync(file, bytes);
    console.log(`saved ${file} (${Math.round(bytes.length / 1024)} KB)`);
    return;
  }
  fail(`request ${id} did not finish in five minutes`);
}

const [command, ...args] = process.argv.slice(2);
const found = credentials();
if (command === "check") {
  console.log(found.pair ? `credentials found (${found.source})` : `credentials incomplete: key id ${found.haveId ? "found" : "missing"}, secret ${found.haveSecret ? "found" : "missing"}`);
  process.exit(found.pair ? 0 : 1);
}
if (!found.pair) fail(`credentials incomplete: key id ${found.haveId ? "found" : "missing"}, secret ${found.haveSecret ? "found" : "missing"}`);

if (command === "estimate") {
  const [aspectRatio, resolution] = args;
  const result = await call(`/estimate/${MODEL}`, {
    method: "POST",
    pair: found.pair,
    body: { prompt: "estimate", aspect_ratio: aspectRatio, resolution, batch_size: 1 },
  });
  console.log(`estimate ${aspectRatio} ${resolution}: HTTP ${result.status} ${result.json ? JSON.stringify(result.json) : result.text}`);
} else if (command === "generate") {
  const [outBase, aspectRatio, resolution, prompt] = args;
  if (!outBase || !aspectRatio || !resolution || !prompt) fail("usage: generate <out-base> <aspect_ratio> <resolution> <prompt>");
  await generate(found.pair, outBase, aspectRatio, resolution, prompt);
} else {
  fail("commands: check | estimate | generate");
}
