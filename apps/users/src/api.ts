import { api } from "@advancedfrontend/auth-session";
import type { UserRecord } from "./mocks/handlers";

export type UsersPage = { items: UserRecord[]; total: number };

export function fetchUsers(params: {
  search: string;
  status: string;
  page: number;
  pageSize: number;
}) {
  const qs = new URLSearchParams({
    search: params.search,
    status: params.status,
    page: String(params.page),
    pageSize: String(params.pageSize),
  });
  return api.get(`/api/users?${qs.toString()}`) as Promise<UsersPage>;
}

export function fetchUser(id: string) {
  return api.get(`/api/users/${id}`) as Promise<UserRecord>;
}

export function activateUser(id: string) {
  return api.post(`/api/users/${id}/activate`) as Promise<UserRecord>;
}

export function deactivateUser(id: string) {
  return api.post(`/api/users/${id}/deactivate`) as Promise<UserRecord>;
}

export function setUserRole(id: string, role: UserRecord["role"]) {
  return api.post(`/api/users/${id}/role`, { role }) as Promise<UserRecord>;
}
