export type LanguageCode = 'ua' | 'en';

export interface ServiceEntry {
  name: string;
  href: string;
  desc: string;
}

export interface ServiceGroup {
  group: string;
  items: ServiceEntry[];
}

export type CatalogItem = ServiceEntry | ServiceGroup;

export interface CatalogCategory {
  category: string;
  color: string;
  items: CatalogItem[];
}

export interface ResourceLink {
  href: string;
  label?: Record<LanguageCode, string> | string;
}

export interface ResourceLinks {
  docs?: string | ResourceLink | ResourceLink[];
  gettingStarted?: string | ResourceLink | ResourceLink[];
  examples?: string | ResourceLink | ResourceLink[];
  tutorials?: string | ResourceLink | ResourceLink[];
  repo?: string | ResourceLink | ResourceLink[];
  support?: string | ResourceLink | ResourceLink[];
  community?: string | ResourceLink | ResourceLink[];
  blog?: string | ResourceLink | ResourceLink[];
  [key: string]: string | ResourceLink | ResourceLink[] | undefined;
}

export interface ServiceResourceEntry {
  name?: string;
  slug?: string;
  href?: string;
  links?: ResourceLinks;
  tags?: string[];
}

export interface ResourceCatalog {
  services: ServiceResourceEntry[];
}

export interface EnrichedService extends ServiceEntry {
  categoryName: string;
  groupName?: string;
  language: LanguageCode;
  slug: string;
  occurrence: number;
  key: string;
  resources?: ServiceResourceEntry;
}

export interface Palette {
  surface: string;
  surfaceBorder: string;
  nodeText: string;
  tooltipBg: string;
  tooltipText: string;
  linkText: string;
  errorText: string;
}
