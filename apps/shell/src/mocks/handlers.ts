import { http, HttpResponse } from "msw";
import type { User } from "@advancedfrontend/contracts";

const TEST_ACCOUNTS: { email: string; password: string; user: User }[] = [
  {
    email: "admin@example.com",
    password: "password",
    user: { id: "1", name: "Ada Admin", roles: ["admin"] },
  },
  {
    email: "viewer@example.com",
    password: "password",
    user: { id: "2", name: "Vic Viewer", roles: ["viewer"] },
  },
];

function issueToken(userId: string) {
  return `demo-token-${userId}-${Date.now()}`;
}

export const handlers = [
  http.post("/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };
    const match = TEST_ACCOUNTS.find((a) => a.email === email && a.password === password);
    if (!match) {
      return HttpResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
    return HttpResponse.json({
      token: issueToken(match.user.id),
      user: match.user,
    });
  }),

  http.post("/session/restore", async ({ request }) => {
    const { userId } = (await request.json()) as { userId: string };
    const match = TEST_ACCOUNTS.find((a) => a.user.id === userId);
    if (!match) {
      return HttpResponse.json({ message: "No session" }, { status: 401 });
    }
    return HttpResponse.json({
      token: issueToken(match.user.id),
      user: match.user,
    });
  }),
];
