import type {
  CatalogCategory,
  LanguageCode,
  ResourceCatalog,
  ServiceResourceEntry,
} from '../types/catalog';
import { buildResourceIndex } from './catalog';

const STORAGE_PREFIX = 'ai-compass-dataset-v2';
const DATA_PATH: Record<LanguageCode, string> = {
  ua: '/data/ua.json',
  en: '/data/en.json',
};
const RESOURCES_PATH = '/data/resources.json';

interface StoredDataset {
  updatedAt: number;
  payload: CatalogCategory[];
}

function getStorageKey(language: LanguageCode): string {
  return `${STORAGE_PREFIX}:${language}`;
}

function readDatasetFromStorage(language: LanguageCode): CatalogCategory[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(language));
    if (!raw) return null;
    const stored: StoredDataset = JSON.parse(raw);
    if (!stored || !Array.isArray(stored.payload)) {
      return null;
    }
    return stored.payload;
  } catch (error) {
    console.warn('Failed to read cached dataset', error);
    return null;
  }
}

function writeDatasetToStorage(language: LanguageCode, payload: CatalogCategory[]): void {
  try {
    const stored: StoredDataset = {
      updatedAt: Date.now(),
      payload,
    };
    localStorage.setItem(getStorageKey(language), JSON.stringify(stored));
  } catch (error) {
    console.warn('Failed to cache dataset', error);
  }
}

export async function loadCatalog(language: LanguageCode, useCache = true): Promise<CatalogCategory[]> {
  if (useCache) {
    const cached = readDatasetFromStorage(language);
    if (cached) {
      return cached;
    }
  }
  const response = await fetch(DATA_PATH[language]);
  if (!response.ok) {
    throw new Error(`Failed to load dataset for ${language}`);
  }
  const data = (await response.json()) as CatalogCategory[];
  if (useCache) {
    writeDatasetToStorage(language, data);
  }
  return data;
}

export function warmupCatalog(language: LanguageCode): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      loadCatalog(language).catch((error) => {
        console.warn(`Failed to warmup dataset for ${language}`, error);
      });
    });
  } else {
    setTimeout(() => {
      loadCatalog(language).catch((error) => {
        console.warn(`Failed to warmup dataset for ${language}`, error);
      });
    }, 400);
  }
}

export async function loadResourceCatalog(): Promise<Map<string, ServiceResourceEntry>> {
  const response = await fetch(RESOURCES_PATH);
  if (!response.ok) {
    throw new Error('Failed to load resource catalog');
  }
  const data = (await response.json()) as ResourceCatalog;
  return buildResourceIndex(Array.isArray(data?.services) ? data.services : []);
}
