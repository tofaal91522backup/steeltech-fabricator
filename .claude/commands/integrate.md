---
description: Implement frontend integration from a filled-in API-change spec
---

# /integrate — spec → frontend code

Argument (required): path to a spec file in `docs/api-changes/`, e.g. `/integrate docs/api-changes/2026-07-29-a35e685.md`

Spec file: `$ARGUMENTS`

## Gate

1. Read the spec file. Extract the text between `<!-- PROMPT:START -->` and `<!-- PROMPT:END -->`.
2. **If the block is empty or whitespace-only: STOP.** Do not write any code. Instead ask the user clarifying questions: which endpoints to integrate now, where each surfaces in the UI (page/feature), and any product decisions the spec can't answer. Wait for answers.

## Implementation (only when the prompt block has content)

3. **Learn the existing conventions first — introduce NO new patterns:**
   - HTTP layer: `src/lib/http/` (`apiClient` = client-side authed axios, `apiServer` = server-side, `PublicApiClient` = unauthed, `request` = typed wrapper, `makeEndpoint` = query-string builder)
   - Data fetching: TanStack Query via `src/hooks/useFetchQuery.ts` and `src/hooks/useMutationHandler.ts`
   - Types: feature-local `src/features/<feature>/_types/*.types.ts`, shared in `src/types/`
   - Feature structure: `src/features/<feature>/_components`, `_pages`, `_types`
   - Services: `src/services/*.service.ts`
   - Env: `src/config/env.client.ts` / `env.server.ts`
   Read a couple of existing examples in the touched feature before writing anything, and match their error/loading/empty-state patterns exactly.

4. Implement, per the spec + prompt block:
   - TypeScript types (mark inferred response shapes with a `// ⚠ inferred from Bruno docs — verify` comment)
   - API client functions / service functions
   - Hooks / service layer (TanStack Query)
   - UI loading / error / empty states
   - **Breaking-change fixes**: use the spec's "Likely affected frontend files" lists to update every existing call-site hit by ⚠ changes (changed URLs, removed/renamed fields). Grep again yourself to be sure the list is complete.
   - Add any new env vars to `.env.example` (and the `env.client.ts`/`env.server.ts` schemas if that's the convention).
   - Run `npm run typecheck` and fix resulting errors.

5. **Update the spec file:**
   - Tick (`- [x]`) each checklist box as its item is actually completed. Leave boxes you did not complete unticked.
   - Append an `## Integration log` section: files created/edited, decisions made, and a "manually double-check" list (especially every inferred response shape and every breaking-change fix).

6. **Do NOT advance the checkpoint** (`sync-state.json`). Finish by reminding the user: after they've verified the work, they run
   `node scripts/bruno-sync.mjs --confirm <spec file>` themselves.
