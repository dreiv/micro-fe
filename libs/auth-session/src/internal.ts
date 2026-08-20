import type { User } from "@advancedfrontend/contracts";
import { setSession } from "./state";

// Write API. Only the shell imports this module — microfrontends never
// reference '@advancedfrontend/auth-session/internal' in their own source,
// so this never ships in their bundles (RFC §7).
export function _setSession(token: string | null, user: User | null) {
  setSession(token, user);
}
