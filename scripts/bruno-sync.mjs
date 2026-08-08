#!/usr/bin/env node
/**
 * bruno-sync.mjs — Bruno collection → frontend integration spec generator.
 *
 * Diffs the Bruno collection (server/bruno/Steeltech fabricators Bruno) between the last synced
 * checkpoint and server HEAD, and writes a markdown spec to
 * client/docs/api-changes/<date>-<shortsha>.md.
 *
 * Usage (run from client/):
 *   node scripts/bruno-sync.mjs              # default: checkpoint..HEAD (cumulative)
 *   node scripts/bruno-sync.mjs SHA1..SHA2   # explicit range override
 *   node scripts/bruno-sync.mjs --full       # snapshot entire collection (first run)
 *   node scripts/bruno-sync.mjs --confirm [specfile]
 *       # HUMAN-ONLY step: advances the checkpoint. Refuses unless every
 *       # checklist box in the spec is ticked.
 *
 * Zero external dependencies. All git commands run inside server/ (read-only:
 * this script never writes anything into server/).
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, "..");
const SERVER_DIR = path.resolve(CLIENT_ROOT, "..", "server");
const COLLECTION = "bruno/Steeltech fabricators Bruno";
const OUT_DIR = path.join(CLIENT_ROOT, "docs", "api-changes");
const STATE_FILE = path.join(OUT_DIR, "sync-state.json");
const METHODS = ["get", "post", "put", "delete", "patch", "options", "head"];

// ---------------------------------------------------------------- utilities

function die(msg) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}
function warn(msg) {
  console.warn(`⚠ ${msg}`);
}

function git(...args) {
  try {
    return execFileSync("git", ["-C", SERVER_DIR, ...args], {
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e) {
    throw new Error(
      `git ${args.join(" ")} failed in ${SERVER_DIR}:\n${e.stderr || e.message}`
    );
  }
}

function gitShow(sha, file) {
  try {
    return git("show", `${sha}:${file}`);
  } catch {
    return null;
  }
}

function shaExists(sha) {
  try {
    git("cat-file", "-e", `${sha}^{commit}`);
    return true;
  } catch {
    return false;
  }
}

function isAncestor(sha, of) {
  try {
    git("merge-base", "--is-ancestor", sha, of);
    return true;
  } catch {
    return false;
  }
}

function isEndpointFile(p) {
  if (!p || !p.endsWith(".bru")) return false;
  if (!(p === COLLECTION || p.startsWith(COLLECTION + "/"))) return false;
  const base = path.posix.basename(p);
  // Bruno config files — never real endpoints:
  if (base === "collection.bru" || base === "folder.bru") return false;
  return true;
}

// ---------------------------------------------------------------- .bru parser

/** Split a .bru file into named blocks. Brace-depth based so nested JSON in
 *  body:json is kept intact. */
function parseBruBlocks(text) {
  const blocks = {};
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^([\w:-]+)\s*\{\s*$/);
    if (!m) {
      i++;
      continue;
    }
    const name = m[1];
    let depth = 1;
    i++;
    const content = [];
    while (i < lines.length && depth > 0) {
      const line = lines[i];
      let closedHere = false;
      for (const ch of line) {
        if (ch === "{") depth++;
        else if (ch === "}") {
          depth--;
          if (depth === 0) {
            closedHere = true;
            break;
          }
        }
      }
      if (!closedHere) content.push(line);
      i++;
    }
    blocks[name] = content.join("\n");
  }
  return blocks;
}

/** Parse `key: value` dictionary blocks (meta, headers, params, http, assert). */
function parseDict(content) {
  const out = [];
  if (!content) return out;
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    let key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    let disabled = false;
    if (key.startsWith("~")) {
      disabled = true;
      key = key.slice(1);
    }
    out.push({ key, value, disabled });
  }
  return out;
}
function dictGet(dict, key) {
  const hit = dict.find((d) => d.key === key);
  return hit ? hit.value : undefined;
}

/** Strip // and /* *​/ comments outside of strings (Bruno bodies contain them). */
function stripJsonComments(text) {
  let out = "";
  let inStr = false;
  let inLine = false;
  let inBlock = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];
    if (inLine) {
      if (c === "\n") {
        inLine = false;
        out += c;
      }
      continue;
    }
    if (inBlock) {
      if (c === "*" && n === "/") {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inStr) {
      out += c;
      if (c === "\\") {
        out += n ?? "";
        i++;
      } else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      out += c;
      continue;
    }
    if (c === "/" && n === "/") {
      inLine = true;
      continue;
    }
    if (c === "/" && n === "*") {
      inBlock = true;
      i++;
      continue;
    }
    out += c;
  }
  return out;
}

function tryParseJson(text) {
  if (!text || !text.trim()) return null;
  let cleaned = stripJsonComments(text);
  // tolerate trailing commas
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/** Flatten JSON into { "dot.path": "type" }. Arrays use [] and sample [0]. */
function flattenFields(value, prefix = "", out = {}) {
  if (Array.isArray(value)) {
    const p = prefix ? `${prefix}[]` : "[]";
    if (value.length === 0) out[p] = "unknown[]";
    else flattenFields(value[0], p, out);
  } else if (value !== null && typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0 && prefix) out[prefix] = "object";
    for (const k of keys) flattenFields(value[k], prefix ? `${prefix}.${k}` : k, out);
  } else {
    out[prefix || "(root)"] = value === null ? "null" : typeof value;
  }
  return out;
}

/** Parse one .bru file into an endpoint description. Returns null if the file
 *  has no HTTP method block (not an endpoint). */
function parseEndpoint(text) {
  const blocks = parseBruBlocks(text);
  const method = METHODS.find((m) => blocks[m] !== undefined);
  if (!method) return null;
  const http = parseDict(blocks[method]);
  const meta = parseDict(blocks["meta"] || "");
  const url = dictGet(http, "url") || "";
  const bodyType = dictGet(http, "body") || "none";
  const bodyBlockName = Object.keys(blocks).find((b) => b.startsWith("body:"));
  const authBlockName = Object.keys(blocks).find((b) => b.startsWith("auth:"));
  const bodyRaw = bodyBlockName ? blocks[bodyBlockName] : "";
  const bodyJson = bodyBlockName === "body:json" ? tryParseJson(bodyRaw) : null;
  return {
    name: dictGet(meta, "name") || "(unnamed)",
    method: method.toUpperCase(),
    url,
    path: url.replace(/^\{\{[^}]+\}\}/, "") || url,
    auth: dictGet(http, "auth") || (authBlockName ? authBlockName : "none"),
    authDetail: authBlockName ? blocks[authBlockName] : "",
    bodyType,
    bodyRaw,
    bodyJson,
    bodyFields: bodyJson ? flattenFields(bodyJson) : null,
    headers: parseDict(blocks["headers"] || ""),
    queryParams: parseDict(blocks["params:query"] || ""),
    pathParams: parseDict(blocks["params:path"] || ""),
    docs: (blocks["docs"] || "").trim(),
    tests: (blocks["tests"] || "").trim(),
    postVars: parseDict(blocks["vars:post-response"] || ""),
    asserts: parseDict(blocks["assert"] || ""),
  };
}

function collectEnvVars(text, set) {
  if (!text) return;
  for (const m of text.matchAll(/\{\{([^{}\n]+)\}\}/g)) set.add(m[1].trim());
}

// ---------------------------------------------------------------- diffing

function fieldDiff(oldFields, newFields) {
  const added = [];
  const removed = [];
  const typeChanged = [];
  const o = oldFields || {};
  const n = newFields || {};
  for (const k of Object.keys(n)) {
    if (!(k in o)) added.push({ field: k, type: n[k] });
    else if (o[k] !== n[k]) typeChanged.push({ field: k, from: o[k], to: n[k] });
  }
  for (const k of Object.keys(o)) {
    if (!(k in n)) removed.push({ field: k, type: o[k] });
  }
  return { added, removed, typeChanged };
}

function paramDiff(oldParams, newParams) {
  const oldKeys = new Set((oldParams || []).map((p) => p.key));
  const newKeys = new Set((newParams || []).map((p) => p.key));
  return {
    added: [...newKeys].filter((k) => !oldKeys.has(k)),
    removed: [...oldKeys].filter((k) => !newKeys.has(k)),
  };
}

/** Determine breaking changes for a modified endpoint. */
function detectBreaking(entry) {
  const breaking = [];
  const o = entry.old;
  const n = entry.new;
  if (!o || !n) return breaking;
  // Compare only the path part — query-string changes are covered by the
  // param diff (only removals are breaking, additions are not).
  const oPath = o.url.split("?")[0].trim();
  const nPath = n.url.split("?")[0].trim();
  if (oPath !== nPath) breaking.push(`URL changed: \`${oPath}\` → \`${nPath}\``);
  if (o.method !== n.method)
    breaking.push(`HTTP method changed: ${o.method} → ${n.method}`);
  if (entry.bodyDiff) {
    for (const r of entry.bodyDiff.removed)
      breaking.push(`Request field removed/renamed: \`${r.field}\` (${r.type})`);
    for (const t of entry.bodyDiff.typeChanged)
      breaking.push(`Request field type changed: \`${t.field}\` ${t.from} → ${t.to}`);
  }
  if (entry.queryDiff) {
    for (const r of entry.queryDiff.removed)
      breaking.push(`Query param removed: \`${r}\``);
  }
  return breaking;
}

// ---------------------------------------------------------------- modes

function loadState() {
  if (!fs.existsSync(STATE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    die(`Could not parse ${STATE_FILE} — fix or delete it.`);
  }
}

function resolveRange(argv) {
  const head = git("rev-parse", "HEAD").trim();
  if (argv.includes("--full")) return { mode: "full", from: null, to: head };

  const rangeArg = argv.find((a) => /^[0-9a-fA-F]{4,40}\.\.[0-9a-fA-F]{4,40}$/.test(a));
  if (rangeArg) {
    const [from, to] = rangeArg.split("..");
    if (!shaExists(from)) die(`Range start ${from} not found in server history.`);
    if (!shaExists(to)) die(`Range end ${to} not found in server history.`);
    return { mode: "range", from: git("rev-parse", from).trim(), to: git("rev-parse", to).trim() };
  }

  const state = loadState();
  if (!state || !state.lastSyncedSha)
    die(
      `No checkpoint found (${path.relative(CLIENT_ROOT, STATE_FILE)}).\n` +
        `  First run:  node scripts/bruno-sync.mjs --full\n` +
        `  Or pass an explicit range:  node scripts/bruno-sync.mjs SHA1..SHA2`
    );
  const from = state.lastSyncedSha;
  if (!shaExists(from))
    die(
      `Checkpoint SHA ${from} no longer exists in server history (rebase/force-push?).\n` +
        `Not proceeding silently. Re-run with an explicit SHA1..SHA2 range or --full.`
    );
  if (!isAncestor(from, head))
    die(
      `Checkpoint SHA ${from} exists but is NOT an ancestor of server HEAD (history rewritten?).\n` +
        `Not proceeding silently. Re-run with an explicit SHA1..SHA2 range or --full.`
    );
  return { mode: "diff", from, to: head };
}

function buildEntries({ mode, from, to }) {
  const entries = [];
  if (mode === "full") {
    const files = git("ls-tree", "-r", "--name-only", to, "--", COLLECTION)
      .split("\n")
      .filter(isEndpointFile);
    for (const f of files) {
      const text = gitShow(to, f);
      const ep = text ? parseEndpoint(text) : null;
      if (!ep) continue; // not an endpoint (no http block)
      entries.push({ status: "snapshot", oldPath: null, newPath: f, old: null, new: ep, newText: text });
    }
    return entries;
  }

  const raw = git("diff", "--name-status", "-M50", from, to, "--", COLLECTION);
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    const code = parts[0];
    let status, oldPath, newPath;
    if (code.startsWith("R") || code.startsWith("C")) {
      status = code.startsWith("R") ? "renamed" : "modified";
      oldPath = parts[1];
      newPath = parts[2];
    } else {
      oldPath = newPath = parts[1];
      status = code === "A" ? "added" : code === "D" ? "removed" : "modified";
    }
    // Filter to real endpoint files only (either side)
    const relevant =
      (newPath && isEndpointFile(newPath)) || (oldPath && isEndpointFile(oldPath));
    if (!relevant) continue;

    const oldText = status === "added" ? null : gitShow(from, oldPath);
    const newText = status === "removed" ? null : gitShow(to, newPath);
    const oldEp = oldText ? parseEndpoint(oldText) : null;
    const newEp = newText ? parseEndpoint(newText) : null;
    if (!oldEp && !newEp) continue; // neither side is an actual endpoint

    const entry = {
      status,
      oldPath,
      newPath,
      old: oldEp,
      new: newEp,
      oldText,
      newText,
    };
    if (oldEp && newEp) {
      const oldUnparseable =
        oldEp.bodyType === "json" && oldEp.bodyRaw.trim() && !oldEp.bodyJson;
      const newUnparseable =
        newEp.bodyType === "json" && newEp.bodyRaw.trim() && !newEp.bodyJson;
      if (oldUnparseable || newUnparseable) {
        entry.bodyParseWarning = `body:json on the ${newUnparseable ? "NEW" : "OLD"} side is not parseable JSON — field-level diff unavailable, compare the bodies manually`;
        entry.bodyDiff = null;
      } else {
        entry.bodyDiff =
          oldEp.bodyFields || newEp.bodyFields
            ? fieldDiff(oldEp.bodyFields, newEp.bodyFields)
            : null;
      }
      entry.queryDiff = paramDiff(oldEp.queryParams, newEp.queryParams);
      entry.breaking = detectBreaking(entry);
      if (entry.bodyParseWarning) entry.breaking.push(entry.bodyParseWarning);
    } else if (!newEp) {
      entry.breaking = [`Endpoint removed entirely`];
    } else {
      entry.breaking = [];
    }
    entries.push(entry);
  }
  return entries;
}

// ---------------------------------------------------------------- markdown

function mdEscape(s) {
  return String(s ?? "").replace(/\|/g, "\\|");
}

function renderDictList(dict, label) {
  if (!dict || dict.length === 0) return `- **${label}:** _none_\n`;
  let out = `- **${label}:**\n`;
  for (const d of dict)
    out += `  - \`${d.key}\`: ${d.value || "_(empty)_"}${d.disabled ? " _(disabled)_" : ""}\n`;
  return out;
}

function renderEndpointDetail(entry) {
  const ep = entry.new || entry.old;
  const statusLabel =
    entry.status === "snapshot" ? "Snapshot" : entry.status[0].toUpperCase() + entry.status.slice(1);
  let out = `### ${ep.method} \`${ep.path}\` — ${ep.name}\n\n`;
  out += `- **Status:** ${statusLabel}`;
  if (entry.breaking && entry.breaking.length) out += ` — ⚠ **BREAKING**`;
  out += `\n`;
  if (entry.status === "renamed")
    out += `- **File renamed:** \`${entry.oldPath}\` → \`${entry.newPath}\`\n`;
  else out += `- **File:** \`${entry.newPath || entry.oldPath}\`\n`;
  out += `- **Full URL:** \`${ep.url}\`\n`;
  out += `- **Auth:** ${ep.auth}${ep.authDetail ? ` — \`${ep.authDetail.replace(/\s+/g, " ").trim()}\`` : ""}\n`;
  out += renderDictList(ep.pathParams, "Path params");
  out += renderDictList(ep.queryParams, "Query params");
  out += renderDictList(ep.headers, "Headers");

  if (ep.bodyType !== "none") {
    out += `- **Request body (${ep.bodyType}):**\n\n`;
    out += "```json\n" + (ep.bodyRaw || "").trim() + "\n```\n\n";
  } else {
    out += `- **Request body:** _none_\n`;
  }

  if (entry.bodyParseWarning) {
    out += `- **⚠ Field-level body diff:** ${entry.bodyParseWarning}\n`;
  }
  if (entry.bodyDiff) {
    const { added, removed, typeChanged } = entry.bodyDiff;
    out += `- **Field-level body diff:**\n`;
    if (!added.length && !removed.length && !typeChanged.length)
      out += `  - _no field changes_\n`;
    for (const a of added) out += `  - ➕ added \`${a.field}\` (${a.type})\n`;
    for (const r of removed) out += `  - ⚠ removed \`${r.field}\` (${r.type})\n`;
    for (const t of typeChanged)
      out += `  - ⚠ type changed \`${t.field}\`: ${t.from} → ${t.to}\n`;
  }
  if (entry.queryDiff && (entry.queryDiff.added.length || entry.queryDiff.removed.length)) {
    out += `- **Query param diff:**`;
    if (entry.queryDiff.added.length)
      out += ` added: ${entry.queryDiff.added.map((k) => `\`${k}\``).join(", ")};`;
    if (entry.queryDiff.removed.length)
      out += ` removed: ${entry.queryDiff.removed.map((k) => `\`${k}\``).join(", ")}`;
    out += `\n`;
  }

  if (ep.postVars.length) {
    out += `- **Captured response vars (vars:post-response):**\n`;
    for (const v of ep.postVars) out += `  - \`${v.key}\` ← \`${v.value}\`\n`;
  } else {
    out += `- **Captured response vars:** _none_\n`;
  }
  if (ep.asserts.length) {
    out += `- **Assertions:**\n`;
    for (const a of ep.asserts) out += `  - \`${a.key}\` ${a.value}\n`;
  }
  if (ep.tests) {
    out += `- **Tests:**\n\n\`\`\`js\n${ep.tests}\n\`\`\`\n\n`;
  }
  if (ep.docs) {
    out += `- **Docs:**\n\n`;
    out += ep.docs
      .split("\n")
      .map((l) => `  > ${l.trim()}`)
      .join("\n");
    out += `\n`;
  }
  if (entry.breaking && entry.breaking.length) {
    out += `- **⚠ Breaking:**\n`;
    for (const b of entry.breaking) out += `  - ${b}\n`;
  }
  out += `\n---\n\n`;
  return out;
}

function renderSpec({ mode, from, to }, entries, envVars) {
  const date = new Date().toISOString().slice(0, 10);
  const removedEntries = entries.filter((e) => e.status === "removed");
  const liveEntries = entries.filter((e) => e.status !== "removed");

  let md = `<!-- SYNC-META\nfrom: ${from || "null"}\nto: ${to}\nmode: ${mode}\ngenerated: ${new Date().toISOString()}\n-->\n\n`;
  md += `# API Changes — ${date} (${mode === "full" ? "full snapshot" : `${from.slice(0, 7)}..${to.slice(0, 7)}`})\n\n`;
  if (mode === "diff") {
    const count = git("rev-list", "--count", `${from}..${to}`).trim();
    md += `_Cumulative diff across ${count} server commit(s)._\n\n`;
  }

  // ---- summary table
  md += `## Summary\n\n| Status | Method | Path | Name |\n|---|---|---|---|\n`;
  for (const e of entries) {
    const ep = e.new || e.old;
    const brk = e.breaking && e.breaking.length ? " ⚠" : "";
    md += `| ${e.status}${brk} | ${ep.method} | \`${mdEscape(ep.path)}\` | ${mdEscape(ep.name)} |\n`;
  }
  md += `\n`;

  // ---- env vars
  md += `## Environment variables used\n\n`;
  if (envVars.size === 0) md += `_none referenced in changed files_\n\n`;
  else {
    for (const v of [...envVars].sort()) md += `- \`{{${v}}}\`\n`;
    md += `\n`;
  }

  // ---- details
  md += `## Endpoint details\n\n`;
  for (const e of liveEntries) md += renderEndpointDetail(e);

  // ---- removed
  md += `## Removed endpoints\n\n`;
  if (!removedEntries.length) md += `_none_\n\n`;
  else {
    for (const e of removedEntries) {
      const ep = e.old;
      md += `- ⚠ **${ep.method}** \`${ep.path}\` — ${ep.name} (\`${e.oldPath}\`): remove client usages.\n`;
    }
    md += `\n`;
  }

  // ---- prompt block (human fills in)
  md += `## Frontend Prompt\n\n`;
  md += `<!-- PROMPT:START -->\n<!-- PROMPT:END -->\n\n`;
  md += `_Fill in the block above (what to build / where it surfaces in the UI), then run \`/integrate <this file>\`._\n\n`;

  // ---- checklist
  md += `## Integration checklist\n\n`;
  md += `- [ ] Types defined/updated in the right \`_types\`/\`src/types\` location\n`;
  md += `- [ ] API client functions added/updated (\`src/lib/http\` / services)\n`;
  md += `- [ ] Hook / service layer wired (TanStack Query)\n`;
  md += `- [ ] UI loading / error / empty states handled\n`;
  md += `- [ ] Env vars added to \`.env.example\`\n`;
  md += `- [ ] Breaking-change fixes applied to existing call-sites\n`;
  md += `\nWhen every box is ticked, advance the checkpoint (manual, human-only step):\n\`\`\`\nnode scripts/bruno-sync.mjs --confirm docs/api-changes/<this file>\n\`\`\`\n`;
  return md;
}

// ---------------------------------------------------------------- confirm mode

function runConfirm(argv) {
  let specArg = argv[argv.indexOf("--confirm") + 1];
  if (!specArg || specArg.startsWith("--")) {
    // pick most recent spec file
    const files = fs
      .readdirSync(OUT_DIR)
      .filter((f) => f.endsWith(".md") && f !== "README.md")
      .map((f) => path.join(OUT_DIR, f))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    if (!files.length) die("No spec files found to confirm.");
    specArg = files[0];
    console.log(`No spec file given — using most recent: ${path.relative(CLIENT_ROOT, specArg)}`);
  }
  const specPath = path.isAbsolute(specArg) ? specArg : path.resolve(CLIENT_ROOT, specArg);
  if (!fs.existsSync(specPath)) die(`Spec file not found: ${specPath}`);
  const text = fs.readFileSync(specPath, "utf8");

  const unchecked = (text.match(/^- \[ \]/gm) || []).length;
  if (unchecked > 0)
    die(
      `Refusing to advance checkpoint: ${unchecked} unchecked checklist item(s) remain in\n  ${specPath}\n` +
        `Finish the integration (or tick the boxes deliberately) first.`
    );

  const metaMatch = text.match(/<!-- SYNC-META\n([\s\S]*?)-->/);
  if (!metaMatch) die("Spec file has no SYNC-META header; cannot determine target SHA.");
  const meta = Object.fromEntries(
    metaMatch[1]
      .trim()
      .split("\n")
      .map((l) => l.split(/:\s(.*)/).slice(0, 2))
  );
  const to = meta.to;
  if (!to || !shaExists(to)) die(`SYNC-META 'to' SHA (${to}) not found in server history.`);

  const state = loadState() || { lastSyncedSha: null, history: [] };
  state.history = state.history || [];
  const specName = path.basename(specPath);
  if (
    state.lastSyncedSha === to &&
    state.history.some((h) => h.specFile === specName && h.to === to)
  ) {
    console.log(
      `✔ Already confirmed: checkpoint is at ${to.slice(0, 7)} for ${specName} — nothing to do.`
    );
    return;
  }
  state.history.push({
    from: meta.from === "null" ? null : meta.from,
    to,
    date: new Date().toISOString().slice(0, 10),
    specFile: path.basename(specPath),
  });
  state.lastSyncedSha = to;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
  console.log(`✔ Checkpoint advanced to ${to.slice(0, 7)} (${path.relative(CLIENT_ROOT, STATE_FILE)})`);
}

// ---------------------------------------------------------------- main

function main() {
  const argv = process.argv.slice(2);

  if (!fs.existsSync(SERVER_DIR)) die(`Server repo not found at ${SERVER_DIR}`);
  try {
    git("rev-parse", "--git-dir");
  } catch {
    die(`${SERVER_DIR} is not a git repository.`);
  }

  if (argv.includes("--confirm")) return runConfirm(argv);

  const range = resolveRange(argv);
  if (range.mode === "diff" && range.from === range.to) {
    console.log("✔ Checkpoint is already at server HEAD — no new commits to sync.");
    return;
  }

  // warn about uncommitted .bru edits in the server worktree (invisible to commit diffs)
  try {
    const dirty = git("status", "--porcelain", "--", COLLECTION)
      .split("\n")
      .filter((l) => l.trim() && l.includes(".bru"));
    if (dirty.length)
      warn(
        `${dirty.length} uncommitted .bru change(s) in server worktree — these are NOT included (diff is commit-based).`
      );
  } catch {
    /* non-fatal */
  }

  const entries = buildEntries(range);
  if (!entries.length) {
    console.log(
      range.mode === "full"
        ? "No endpoint files found in the collection."
        : `✔ No .bru endpoint changes between ${range.from.slice(0, 7)} and ${range.to.slice(0, 7)}.`
    );
    return;
  }

  const envVars = new Set();
  for (const e of entries) collectEnvVars(e.newText || e.oldText, envVars);

  const md = renderSpec(range, entries, envVars);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  let fname = `${date}-${range.to.slice(0, 7)}.md`;
  let n = 2;
  while (fs.existsSync(path.join(OUT_DIR, fname)))
    fname = `${date}-${range.to.slice(0, 7)}-${n++}.md`;
  const outPath = path.join(OUT_DIR, fname);
  fs.writeFileSync(outPath, md);

  const breakingCount = entries.filter((e) => e.breaking && e.breaking.length).length;
  console.log(`✔ Spec written: ${path.relative(CLIENT_ROOT, outPath)}`);
  console.log(
    `  ${entries.length} endpoint(s) — ` +
      `${entries.filter((e) => e.status === "added").length} added, ` +
      `${entries.filter((e) => e.status === "modified" || e.status === "renamed").length} modified, ` +
      `${entries.filter((e) => e.status === "removed").length} removed` +
      (range.mode === "full" ? " (full snapshot)" : "") +
      (breakingCount ? ` — ⚠ ${breakingCount} with breaking changes` : "")
  );
  console.log(
    `  Checkpoint NOT advanced. After integration is complete and checklist ticked:\n` +
      `  node scripts/bruno-sync.mjs --confirm docs/api-changes/${fname}`
  );
}

main();
