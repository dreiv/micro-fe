export type AppEvents = {
  "user:deactivated": { userId: string; userName: string; by: string };
  "notifications:new": { message: string };
};
