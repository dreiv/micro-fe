import { http, HttpResponse } from "msw";
import type { Role } from "@advancedfrontend/contracts";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "inactive";
};

const FIRST_NAMES = [
  "Ada",
  "Grace",
  "Alan",
  "Barbara",
  "Linus",
  "Margaret",
  "Dennis",
  "Katherine",
  "Tim",
  "Radia",
];
const LAST_NAMES = [
  "Lovelace",
  "Hopper",
  "Turing",
  "Liskov",
  "Torvalds",
  "Hamilton",
  "Ritchie",
  "Johnson",
  "Berners-Lee",
  "Perlman",
];

function buildSeedUsers(): UserRecord[] {
  const users: UserRecord[] = [];
  for (let i = 0; i < FIRST_NAMES.length; i += 1) {
    for (let j = 0; j < LAST_NAMES.length; j += 1) {
      const id = String(users.length + 1);
      const name = `${FIRST_NAMES[i]} ${LAST_NAMES[j]}`;
      users.push({
        id,
        name,
        email: `${FIRST_NAMES[i].toLowerCase()}.${LAST_NAMES[j].toLowerCase()}@example.com`,
        role: Number(id) % 9 === 0 ? "admin" : "viewer",
        status: Number(id) % 7 === 0 ? "inactive" : "active",
      });
    }
  }
  return users;
}

const users: UserRecord[] = buildSeedUsers();

export const handlers = [
  http.get("/api/users", ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() ?? "";
    const status = url.searchParams.get("status");
    const page = Number(url.searchParams.get("page") ?? "0");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "10");

    const filtered = users.filter((u) => {
      const matchesSearch =
        !search || u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search);
      const matchesStatus = !status || status === "all" || u.status === status;
      return matchesSearch && matchesStatus;
    });

    const start = page * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ items, total: filtered.length });
  }),

  http.get("/api/users/:id", ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  http.post("/api/users/:id/activate", ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    user.status = "active";
    return HttpResponse.json(user);
  }),

  http.post("/api/users/:id/deactivate", ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    user.status = "inactive";
    return HttpResponse.json(user);
  }),

  http.post("/api/users/:id/role", async ({ params, request }) => {
    const user = users.find((u) => u.id === params.id);
    if (!user) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    const { role } = (await request.json()) as { role: Role };
    user.role = role;
    return HttpResponse.json(user);
  }),
];
