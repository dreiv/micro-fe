export type Role = "admin" | "viewer";

export type User = {
  id: string;
  name: string;
  roles: Role[];
};
