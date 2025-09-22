const BASE_URL = import.meta.env.BASE_URL ?? '/';

function isAbsoluteUrl(path: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(path);
}

export function withBase(path: string): string {
  if (!path) {
    const normalizedBase =
      BASE_URL === '/' ? '' : BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return normalizedBase || '/';
  }

  if (isAbsoluteUrl(path)) {
    return path;
  }

  const normalizedBase =
    BASE_URL === '/' ? '' : BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  if (!normalizedBase) {
    return `/${normalizedPath}`;
  }

  return `${normalizedBase}/${normalizedPath}`;
}
