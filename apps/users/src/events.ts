import { emit } from "@advancedfrontend/contracts";
import type { User } from "@advancedfrontend/contracts";
import type { UserRecord } from "./mocks/handlers";

// Team A doesn't know or care who's listening — it just announces what
// happened (RFC §10). No import of the shell or any other microfrontend.
export function emitUserDeactivated(deactivatedUser: UserRecord, by: User | null) {
  emit("user:deactivated", {
    userId: deactivatedUser.id,
    userName: deactivatedUser.name,
    by: by?.name ?? "someone",
  });
}
