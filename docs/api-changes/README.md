# API change sync (Bruno → frontend)

Workflow for integrating backend API changes, driven by the Bruno collection in `../server/DiscoverAI` (its git history is the source of truth). Nothing is ever silently missed: change detection is a deterministic script; AI only interprets the result.

## The loop

1. **`/api-sync`** (or `npm run api:sync`) — diffs the Bruno collection from the last checkpoint to server HEAD (cumulative across all commits in between) and writes a spec here: `<date>-<shortsha>.md`. The slash command then enriches it: breaking-changes summary, affected frontend files, inferred response shapes.
2. **Human step** — read the spec, fill in the `<!-- PROMPT:START --> ... <!-- PROMPT:END -->` block: what to build and where it appears in the UI.
3. **`/integrate docs/api-changes/<spec>.md`** — implements types, API functions, hooks, UI states, and breaking-change fixes following existing conventions; ticks the checklist; appends an integration log. Refuses to code if the prompt block is empty.
4. **Human step — advance the checkpoint (never automatic):**

   ```
   node scripts/bruno-sync.mjs --confirm docs/api-changes/<spec>.md
   ```

   This only succeeds when every checklist box in the spec is ticked. It moves `lastSyncedSha` in `sync-state.json` forward and records history. Neither slash command ever does this on its own — if you don't confirm, the next `/api-sync` simply re-includes the same changes (cumulative), so nothing is lost.

## Other script modes

- `node scripts/bruno-sync.mjs --full` — snapshot the whole collection (first-time run; no diff)
- `node scripts/bruno-sync.mjs SHA1..SHA2` — explicit range override

## sync-state.json

```json
{
  "lastSyncedSha": "<server commit already integrated>",
  "history": [ { "from": "...", "to": "...", "date": "...", "specFile": "..." } ]
}
```

If the checkpoint SHA disappears from server history (rebase/force-push), the script stops with a warning instead of proceeding — re-run with an explicit range or `--full`.

Notes: `collection.bru` / `folder.bru` are Bruno config files and are always excluded. Uncommitted `.bru` edits in the server worktree are invisible to the diff (commit-based) — the script warns when it sees any.
