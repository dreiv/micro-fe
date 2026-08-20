export type ManifestEntry = {
  name: string;
  entry: string;
  route: string;
  navLabel: string;
};

export type Manifest = {
  microfrontends: ManifestEntry[];
};

export async function fetchManifest(): Promise<Manifest> {
  const res = await fetch("/manifest.json");
  if (!res.ok) {
    throw new Error(`Failed to load manifest.json: ${res.status}`);
  }
  return res.json();
}
