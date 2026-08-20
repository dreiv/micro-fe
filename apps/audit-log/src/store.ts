import { ref } from "vue";
import { on } from "@advancedfrontend/contracts";

export type AuditEntry = { id: string; message: string; at: string };

// Module-scope, not inside a component: Root only mounts while the
// /audit-log route is active, so a listener registered in Root's onMounted
// would miss any event fired while a different microfrontend is showing —
// exactly the demo scenario this team exists for (deactivate a user from
// Users, then check Audit Log). Same fix as step 7's Orders refresh.
const entries = ref<AuditEntry[]>([]);

on("user:deactivated", ({ userName, by }) => {
  entries.value.unshift({
    id: `${Date.now()}`,
    message: `User ${userName} was deactivated by ${by}`,
    at: new Date().toLocaleTimeString(),
  });
});

export function useAuditEntries() {
  return entries;
}
