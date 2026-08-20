import { ref } from "vue";
import { on } from "@advancedfrontend/contracts";

export type AuditEntry = { id: string; message: string; at: string };

// Module-scope listener: Root only mounts on /audit-log, so an onMounted
// listener would miss events fired while another microfrontend is showing.
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
