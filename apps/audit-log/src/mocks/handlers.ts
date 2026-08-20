import type { RequestHandler } from "msw";

// Team C has no backend of its own for this demo — it only listens on the
// shared event bus. Exposed anyway so the shell's handler aggregation (which
// loads every microfrontend's ./mockHandlers) doesn't need a special case for
// a team that happens to have none.
export const handlers: RequestHandler[] = [];
