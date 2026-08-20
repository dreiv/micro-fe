import { setupWorker, type RequestHandler } from "msw/browser";
import { handlers as shellHandlers } from "./handlers";

export function createWorker(remoteHandlers: RequestHandler[] = []) {
  return setupWorker(...shellHandlers, ...remoteHandlers);
}
