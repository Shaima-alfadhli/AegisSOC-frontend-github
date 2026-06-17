const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Public asset path (respects GitHub Pages basePath). */
export function publicAsset(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
