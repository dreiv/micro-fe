import type { User } from "@advancedfrontend/contracts";
import { _setSession } from "@advancedfrontend/auth-session/internal";

const RESTORE_MARKER_KEY = "demo-session-user";

export async function login(email: string, password: string) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password");
  }
  const { token, user } = (await res.json()) as { token: string; user: User };
  _setSession(token, user);
  sessionStorage.setItem(RESTORE_MARKER_KEY, JSON.stringify(user));
}

export async function restoreSession(): Promise<boolean> {
  const stored = sessionStorage.getItem(RESTORE_MARKER_KEY);
  if (!stored) {
    return false;
  }
  const storedUser = JSON.parse(stored) as User;
  const res = await fetch("/session/restore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: storedUser.id }),
  });
  if (!res.ok) {
    sessionStorage.removeItem(RESTORE_MARKER_KEY);
    return false;
  }
  const { token, user } = (await res.json()) as { token: string; user: User };
  _setSession(token, user);
  return true;
}

export function logout() {
  _setSession(null, null);
  sessionStorage.removeItem(RESTORE_MARKER_KEY);
}
