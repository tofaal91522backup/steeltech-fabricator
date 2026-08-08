---
description: Generate API-change spec from the Bruno collection and enrich it (no code writing)
allowed-tools: Bash(node scripts/bruno-sync.mjs*), Bash(npm run api:sync*), Read, Grep, Glob, Edit
---

# /api-sync — Bruno → spec generation

Arguments (optional, passed through): `$ARGUMENTS` — may be `--full` or an explicit `SHA1..SHA2` range.

## Steps

1. From the client root, run: `node scripts/bruno-sync.mjs $ARGUMENTS`
   - The script diffs the sibling `../server` repo's Bruno collection (`server/DiscoverAI`) from the checkpoint in `docs/api-changes/sync-state.json` to server HEAD.
   - If it errors about a missing/invalid checkpoint, relay the error to the user verbatim and stop — do NOT work around it.
   - If it reports "no new commits" or "no changes", tell the user and stop.

2. Read the spec file it wrote (path is in the script output, `docs/api-changes/<date>-<sha>.md`).

3. **Enrich the spec file** (edit it in place):
   a. **Breaking changes section** — insert a `## Breaking changes` section right after the Summary table, summarizing every endpoint flagged ⚠ (what changed, why it breaks existing client code).
   b. **Affected frontend files** — for each changed endpoint, Grep `src/` for:
      - the URL path (and meaningful segments of it, e.g. `/suppliers/services`)
      - changed/removed field names from the field-level diff
      Under each endpoint's detail section add a `**Likely affected frontend files:**` list of the matching files (or `_none found_`). This is how nothing gets silently missed — do this for EVERY endpoint in the spec, including removed ones.
   c. **Response shapes** — for each added/modified endpoint, in this priority order:
      - **If the `Docs` text contains an example response JSON** (some files have "Example response … captured live" blocks): derive the TypeScript response type directly from it and label it `**Response shape (from docs example):**`. This is authoritative.
      - **Otherwise infer** a best-guess TypeScript shape from the `Docs` prose (field lists, status options, semantics), assertions, tests, captured vars, and naming conventions of similar existing endpoints. Label it:
        ```
        **Inferred response shape (⚠ INFERRED — verify against a real response):**
        ```
        Never present an inferred shape as authoritative.

4. **Do NOT write any application code.** This command only produces/enriches the spec.

5. Finish by telling the user:
   - the spec file path
   - the number of endpoints and breaking changes
   - next step: *"Fill in the `<!-- PROMPT:START -->` block in the spec (what to build, where it appears in the UI), then run `/integrate <spec file path>`."*
