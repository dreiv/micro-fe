export type RouteLike = { params: Record<string, unknown> };

/**
 * The shell registers each microfrontend's route as
 * `${mf.route}/:pathMatch(.*)*`. Vue Router always returns `pathMatch`
 * as a string[] — an empty array on the index route (e.g. `/users`),
 * a one-element array on a detail route (e.g. `/users/42` -> ["42"]).
 * It is NEVER a plain string. Read it through these two helpers instead
 * of comparing route.params.pathMatch to a string directly.
 */
export function getTailSegments(route: RouteLike): string[] {
  const raw = route.params.pathMatch;
  if (Array.isArray(raw)) return raw.filter(Boolean) as string[];
  if (typeof raw === "string" && raw !== "") return [raw];
  return [];
}

export function getTailParam(route: RouteLike): string | null {
  const segments = getTailSegments(route);
  return segments.length > 0 ? segments[0] : null;
}
