# AGENTS.md

Guidance for AI coding agents working in this repo. Read this first; see
[README.md](README.md) for the architecture diagram, feature walkthrough, and
demo accounts.

A **Vue 3 + Module Federation** microfrontend backoffice: one **shell** host
plus three independently deployed **remotes** (`users`, `orders`, `audit-log`),
composed at runtime. Shared code lives in three source-only libs
(`contracts`, `ui`, `auth-session`). Toolchain is **vite-plus** (`vp`), a
pnpm monorepo — **not** plain Vite.

## Commands

| Command                   | What it does                                                                                                           |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                | Start all 4 apps in parallel (`vp run -r --parallel dev`). Shell is at `http://localhost:4200`.                        |
| `pnpm --filter <app> dev` | Run one app standalone (shell 4200, users 4201, orders 4202, audit-log 4203).                                          |
| `vp check`                | **The real gate**: format (Oxfmt) + lint (Oxlint) + **type-check** in one pass. Run this before considering work done. |
| `pnpm ready`              | `vp check` → `vp run -r test` → `vp run -r build`. The "is the repo healthy" command.                                  |
| `vp run -r build`         | Build all 4 apps (libs are source-only, no build step).                                                                |

Notes:

- `vp <cmd>` is a **built-in** (e.g. `vp dev`, `vp build`, `vp test`); `vp run <script>` runs a package script. They happen to coincide here but don't assume it.
- **There are no tests.** `vp run -r test` is a no-op today (no `test` scripts, no test files). Don't assume a test suite exists.
- Lint enforces `vite-plus/prefer-vite-plus-imports: error` — import from `vite-plus`, not raw `vite`.

## Architecture (the load-bearing parts)

- **Shell is the only entry point.** It fetches `apps/shell/public/manifest.json`, calls `registerRemotes(...)`, and lazily `loadRemote()`s each remote's `Root` when you navigate to its route. No build-time coupling — a downed remote shows a fallback while the rest of the shell works.
- **Remotes never import each other.** They communicate only through the typed event bus in `@advancedfrontend/contracts` (backed by `BroadcastChannel`, so events cross tabs).
- **Routing is shell-owned.** The shell builds routes as `${mf.route}/:pathMatch(.*)*` and reads the manifest via `inject("manifest")`. A detail id arrives as **`route.params.pathMatch`** — Vue Router always returns it as a `string[]` (empty array on the index route, one element on a detail route), **never a plain string**. Read it with `getTailParam`/`getTailSegments` from `@advancedfrontend/contracts` — never by comparing it to `""` (that comparison is always true and was a real bug).
- **State is plain Vue reactivity** (no Pinia). Per-app `store.ts` holds UI-only state via module-scope `ref`s + a `useXxxFilters()` composable. Cross-app shared state lives in the libs, backed by **window globals**.
- **MSW is the entire backend** — there is no real server. Each app exposes `./mockHandlers`; the shell loads them via `loadRemote` (`Promise.allSettled`) and combines them into one worker.

## Conventions

- Components: `<script setup lang="ts">` SFCs, `defineProps`/`defineEmits` with TS generics, `<style scoped>`, design tokens via CSS vars from `@advancedfrontend/ui/tokens.css`.
- **Never `fetch` directly in components.** Use the `api` client from `@advancedfrontend/auth-session` (attaches the Bearer token). Each app has a thin `api.ts` wrapping `api.get`/`api.post` with typed returns.
- Data loading: `ref` for `items`/`total`/`loading` + `watch([filters], load, { immediate: true })`; `PAGE_SIZE = 10`; re-`load()` after mutations.
- Cross-app events: `emit(...)` / `on(...)` from `@advancedfrontend/contracts`. `on` returns an unsubscribe — call it in `onBeforeUnmount` when component-scoped. Register at **module scope** (not `onMounted`) if events can fire while your app isn't the visible one.
- Shared domain types come from `@advancedfrontend/contracts`; per-app record types (`UserRecord`, `OrderRecord`) are exported from each app's `mocks/handlers.ts`.
- Per-app file layout: `Root.vue` (the exposed screen), `App.vue` (standalone stub), `main.ts`, `store.ts`, `api.ts`, `mocks/handlers.ts`, plus `XxxTable.vue`/`XxxDetail.vue`.
- **Auth/roles are presentational only.** Role checks are `v-if="isAdmin"` in components — there is no route guard or server-side enforcement.

## Gotchas (verified — do not "fix" these)

- **MF `shared` is only `["vue", "vue-router"]` in every app.** Do NOT add a workspace source package (e.g. `@advancedfrontend/auth-session`) to `shared` — the `@module-federation/vite` plugin crashes with a `Pre-transform error ... \x00virtual:mf:...loadShare__vue__...`. Cross-app shared state must go through window globals instead.
- **Window globals are load-bearing.** `window.__appSession__` (session singleton) and `window.__appEventsChannel` (the `BroadcastChannel`, stored on window to survive HMR). Every bundled copy of the lib depends on them being the same object — don't move them to module scope.
- **`registerRemotes` needs `type: "module"`** per remote (the Vite plugin emits `remoteEntry.js` as an ES module).
- **`Button.vue` uses `v-bind="$attrs"`, not `v-on="$attrs"`.** `v-on` turns `type`/`disabled` into event listeners (`onType`) and breaks form submit.
- **MF `name` ≠ folder ≠ route** for audit-log: MF name `auditLog`, folder `audit-log`, route `/audit-log`. The `manifest.json` `name` must equal the MF `name` or `registerRemotes`/`loadRemote` break.
- **Retry must clear two caches** (see `RemoteMount.vue`): the local `remoteComponentCache` **and** the MF runtime's internal `window.__GLOBAL_LOADING_REMOTE_ENTRY__` keys starting with `${remoteName}:`, or `loadRemote` returns the same rejected promise.
- **Standalone `App.vue`s are stubs** (`users`/`orders` just render an `<h1>`); the real screens are the `Root.vue`s. Don't add real UI to `App.vue` expecting it to show in the shell.
- **`pnpm-workspace.yaml` `allowBuilds: msw: true`** — records that msw's postinstall (which sets up the mock service worker file) is allowed to run. The key is non-standard (pnpm does not read it), so it's inert documentation — don't treat it as a real pnpm setting or remove it.
- The DTS warning `TS6054 ... Root.vue has an unsupported extension` is non-fatal (falls back to exposed files).
