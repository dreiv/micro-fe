import type { RequestHandler } from "msw";

// No backend of our own — exposed (empty) so the shell's handler aggregation
// doesn't need a special case for a team with no handlers.
export const handlers: RequestHandler[] = [];
