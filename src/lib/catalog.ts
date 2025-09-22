import type {
  CatalogCategory,
  CatalogItem,
  LanguageCode,
  ServiceEntry,
  ServiceGroup,
  ServiceResourceEntry,
} from '../types/catalog';
import { slugify } from './strings';

export function isGroup(item: CatalogItem): item is ServiceGroup {
  return Boolean(item && typeof (item as ServiceGroup).group === 'string' && Array.isArray((item as ServiceGroup).items));
}

export function makeServiceKey(service: ServiceEntry): string {
  return slugify(service.name);
}

export function buildCompositeKey(serviceId: string, occurrence: number): string {
  return `${serviceId}__${occurrence}`;
}

export function flattenServices(
  categories: CatalogCategory[],
  language: LanguageCode,
): ServiceEntry[] {
  const services: ServiceEntry[] = [];
  categories.forEach((category) => {
    category.items.forEach((item) => {
      if (isGroup(item)) {
        item.items.forEach((svc) => services.push(svc));
      } else {
        services.push(item);
      }
    });
  });
  return services;
}

export function normalizeResourceEntry(entry: ServiceResourceEntry): ServiceResourceEntry {
  return {
    ...entry,
    slug: entry.slug || (entry.name ? slugify(entry.name) : undefined),
  };
}

export function buildResourceIndex(entries: ServiceResourceEntry[]): Map<string, ServiceResourceEntry> {
  const map = new Map<string, ServiceResourceEntry>();
  entries.forEach((raw) => {
    const entry = normalizeResourceEntry(raw);
    const identifiers = new Set<string>();
    if (entry.slug) identifiers.add(entry.slug);
    if (entry.name) identifiers.add(slugify(entry.name));
    if (entry.href) {
      try {
        const url = new URL(entry.href);
        identifiers.add(url.hostname.replace(/^www\./, ''));
        identifiers.add(url.origin);
      } catch (error) {
        // ignore malformed urls
      }
    }
    identifiers.forEach((id) => {
      if (!map.has(id)) {
        map.set(id, entry);
      }
    });
  });
  return map;
}

export function findResourceEntry(
  index: Map<string, ServiceResourceEntry>,
  service: ServiceEntry,
): ServiceResourceEntry | undefined {
  const slug = slugify(service.name);
  if (index.has(slug)) {
    return index.get(slug);
  }
  try {
    const url = new URL(service.href);
    const host = url.hostname.replace(/^www\./, '');
    if (index.has(host)) {
      return index.get(host);
    }
    if (index.has(url.origin)) {
      return index.get(url.origin);
    }
  } catch (error) {
    // ignore invalid url
  }
  return undefined;
}

export function isServiceEntry(item: CatalogItem): item is ServiceEntry {
  return Boolean((item as ServiceEntry).name && (item as ServiceEntry).href);
}
