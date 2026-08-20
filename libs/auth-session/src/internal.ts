import type { User } from "@advancedfrontend/contracts";
import { setSession } from "./state";

// Write API. Only the shell imports this — microfrontends never reference
// it, so it never ships in their bundles (RFC §7).
export function _setSession(token: string | null, user: User | null) {
  setSession(token, user);
}
