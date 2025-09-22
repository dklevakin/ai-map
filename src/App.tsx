import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import type {
  CatalogCategory,
  EnrichedService,
  LanguageCode,
  Palette,
  ServiceEntry,
  ServiceGroup,
  ServiceResourceEntry,
} from './types/catalog';
import { COPY } from './lib/copy';
import { loadCatalog, loadResourceCatalog, warmupCatalog } from './lib/data';
import { MindMapCanvas } from './components/MindMapCanvas';
import { DetailsPanel } from './components/DetailsPanel';
import { ListAccordion } from './components/ListAccordion';
import { LanguageToggle } from './components/LanguageToggle';
import { ThemeToggle } from './components/ThemeToggle';
import { ViewToggle } from './components/ViewToggle';
import { useMediaQuery } from './hooks/useMediaQuery';
import { buildCompositeKey, findResourceEntry, makeServiceKey } from './lib/catalog';
import { withBase } from './lib/paths';
import type { ThemeMode, ViewMode } from './types/ui';

const LANG_STORAGE_KEY = 'ai-compass:language';
const THEME_STORAGE_KEY = 'ai-compass:theme';
const VIEW_STORAGE_KEY = 'ai-compass:view-mode';
const HERO_LOGO = withBase('assets/brand-logo.svg');
const HERO_BADGE_LOGO = withBase('assets/favicon.svg');

function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Unable to read "${key}" from localStorage`, error);
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Unable to persist "${key}" in localStorage`, error);
  }
}

function readStoredLanguage(): LanguageCode {
  if (typeof window === 'undefined') {
    return 'ua';
  }
  const stored = safeGetItem(LANG_STORAGE_KEY);
  if (stored === 'en' || stored === 'ua') {
    return stored;
  }
  const navigatorLanguage = window.navigator?.language;
  const prefersUa = navigatorLanguage ? navigatorLanguage.toLowerCase().startsWith('uk') : false;
  return prefersUa ? 'ua' : 'en';
}

function readStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = safeGetItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  const prefersLight = !!window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

function readStoredView(): ViewMode {
  if (typeof window === 'undefined') {
    return 'map';
  }
  const stored = safeGetItem(VIEW_STORAGE_KEY);
  if (stored === 'map' || stored === 'list') {
    return stored;
  }
  const prefersList = !!window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
  return prefersList ? 'list' : 'map';
}

function readPalette(): Palette {
  if (typeof window === 'undefined') {
    return {
      surface: '#111827',
      surfaceBorder: 'rgba(148, 163, 184, 0.25)',
      nodeText: '#f8fafc',
      tooltipBg: '#020617',
      tooltipText: '#f8fafc',
      linkText: '#60a5fa',
      errorText: '#fca5a5',
    } as Palette;
  }
  const styles = window.getComputedStyle(document.body);
  const read = (prop: string, fallback: string) => {
    const value = styles.getPropertyValue(prop).trim();
    return value || fallback;
  };
  return {
    surface: read('--surface-color', '#111827'),
    surfaceBorder: read('--surface-border', 'rgba(148, 163, 184, 0.25)'),
    nodeText: read('--node-text', '#f8fafc'),
    tooltipBg: read('--tooltip-bg', '#020617'),
    tooltipText: read('--tooltip-text', '#f8fafc'),
    linkText: read('--color-link', '#60a5fa'),
    errorText: read('--color-error', '#fca5a5'),
  };
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => readStoredLanguage());
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme());
  const [viewMode, setViewMode] = useState<ViewMode>(() => readStoredView());
  const [searchQuery, setSearchQuery] = useState('');
  const [catalog, setCatalog] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resources, setResources] = useState<Map<string, ServiceResourceEntry> | null>(null);
  const [selectedService, setSelectedService] = useState<EnrichedService | null>(null);
  const [selectedServiceKey, setSelectedServiceKey] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Map<string, Set<string>>>(new Map());
  const [palette, setPalette] = useState<Palette>(() => readPalette());

  const isNarrow = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    document.body.dataset.theme = theme;
    safeSetItem(THEME_STORAGE_KEY, theme);
    setPalette(readPalette());
  }, [theme]);

  useEffect(() => {
    safeSetItem(LANG_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    safeSetItem(VIEW_STORAGE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadCatalog(language)
      .then((data) => {
        setCatalog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });
    warmupCatalog(language === 'ua' ? 'en' : 'ua');
  }, [language]);

  useEffect(() => {
    loadResourceCatalog()
      .then(setResources)
      .catch(() => {
        setResources(null);
      });
  }, []);

  useEffect(() => {
    if (!safeGetItem(VIEW_STORAGE_KEY)) {
      setViewMode(isNarrow ? 'list' : 'map');
    }
  }, [isNarrow]);

  useEffect(() => {
    setExpandedCategory(null);
    setExpandedGroups(new Map());
    setSelectedService(null);
    setSelectedServiceKey(null);
  }, [language]);

  const handleToggleCategory = useCallback((index: number) => {
    setExpandedCategory((prev) => (prev === index ? null : index));
  }, []);

  const handleToggleGroup = useCallback((categoryIndex: number, groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Map(prev);
      const key = `${categoryIndex}`;
      const existing = new Set(next.get(key) || []);
      if (existing.has(groupName)) {
        existing.delete(groupName);
      } else {
        existing.add(groupName);
      }
      next.set(key, existing);
      return next;
    });
  }, []);

  const handleSelectService = useCallback(
    ({
      service,
      category,
      group,
      occurrence,
    }: {
      service: ServiceEntry;
      category: CatalogCategory;
      group?: ServiceGroup | null;
      occurrence: number;
    }) => {
      const slug = makeServiceKey(service);
      const key = buildCompositeKey(slug, occurrence);
      const resourceEntry = resources ? findResourceEntry(resources, service) : undefined;
      setSelectedService({
        ...service,
        categoryName: category.category,
        groupName: group?.group,
        language,
        slug,
        occurrence,
        key,
        resources: resourceEntry,
      });
      setSelectedServiceKey(key);
    },
    [language, resources],
  );

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    setTheme(mode);
  }, []);

  const handleLanguageChange = useCallback((code: LanguageCode) => {
    setLanguage(code);
  }, []);

  const handleSearchInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedService(null);
    setSelectedServiceKey(null);
  }, []);

  const heroBadgeLabel = COPY.heroBadge[language];
  const heroCtaLabel = COPY.heroCtaLabel[language];
  const heroCtaTitle = COPY.heroCtaTitle[language];
  const quickLinks = [
    {
      href: '#catalog',
      label: COPY.quickNavCatalog[language],
      icon: '🗺️',
    },
    {
      href: '#resources',
      label: COPY.quickNavResources[language],
      icon: '📚',
    },
    {
      href: '#site-footer',
      label: COPY.quickNavFooter[language],
      icon: 'ℹ️',
    },
  ];

  return (
    <div className="app">
      <header className="top-banner">
        <div className="wrap top-banner__inner">
          <span className="top-banner__pill">AI Catalog</span>
          <span>{COPY.banner[language]}</span>
        </div>
      </header>
      <header className="hero">
        <div className="wrap hero__inner">
          <div className="hero__brand">
            <img src={HERO_LOGO} alt="AI Compass logomark" className="hero__logo" />
            <div className="hero__title-block">
              <span className="hero__badge">
                <img src={HERO_BADGE_LOGO} alt="" className="hero__badge-logo" />
                {heroBadgeLabel}
              </span>
              <h1 className="hero__title">{COPY.heroTitle[language]}</h1>
              <p className="hero__subtitle">{COPY.heroSubtitle[language]}</p>
              <p className="hero__description">{COPY.heroDescription[language]}</p>
            </div>
          </div>
          <div className="hero__actions">
            <div className="hero__toggles">
              <LanguageToggle value={language} onChange={handleLanguageChange} />
              <ThemeToggle value={theme} language={language} onChange={handleThemeChange} />
            </div>
            <div className="hero__view">
              <ViewToggle value={viewMode} language={language} onChange={setViewMode} />
            </div>
            <a
              className="hero__cta"
              href="#catalog"
              title={heroCtaTitle}
              aria-label={heroCtaTitle}
            >
              {heroCtaLabel}
            </a>
          </div>
          <nav className="hero__quick-links" aria-label={COPY.quickNavLabel[language]}>
            <ul className="hero__quick-links-list">
              {quickLinks.map(({ href, label, icon }) => (
                <li key={href} className="hero__quick-links-item">
                  <a className="hero__quick-link" href={href}>
                    <span aria-hidden="true" className="hero__quick-link-icon">
                      {icon}
                    </span>
                    <span className="hero__quick-link-text">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="wrap main-layout" id="catalog" tabIndex={-1}>
        <section className="panel" aria-live="polite">
          <h2>{viewMode === 'map' ? COPY.mapHeading[language] : COPY.listHeading[language]}</h2>
          <div className="search">
            <input
              className="search__input"
              value={searchQuery}
              onChange={handleSearchInput}
              placeholder={COPY.searchPlaceholder[language]}
              aria-label={COPY.searchAria[language]}
            />
          </div>
          {loading && <p className="map-note">{COPY.loading[language]}</p>}
          {error && !loading && <p className="map-note">{COPY.loadError[language]}</p>}
          {!loading && !error && viewMode === 'map' && (
            <div className="map-container">
              <MindMapCanvas
                categories={catalog}
                language={language}
                searchQuery={searchQuery}
                expandedCategory={expandedCategory}
                expandedGroups={expandedGroups}
                palette={palette}
                selectedServiceKey={selectedServiceKey}
                resources={resources}
                onToggleCategory={handleToggleCategory}
                onToggleGroup={handleToggleGroup}
                onSelectService={handleSelectService}
              />
            </div>
          )}
          {!loading && !error && viewMode === 'list' && (
            <ListAccordion
              categories={catalog}
              language={language}
              searchQuery={searchQuery}
              selectedServiceKey={selectedServiceKey}
              expandedCategory={expandedCategory}
              expandedGroups={expandedGroups}
              resources={resources}
              onToggleCategory={handleToggleCategory}
              onToggleGroup={handleToggleGroup}
              onSelectService={handleSelectService}
            />
          )}
          {!loading && !error && (
            <p className="map-note">
              {viewMode === 'map' ? COPY.infoNote[language] : COPY.accordionNote[language]}
            </p>
          )}
        </section>
        <aside className="panel" role="complementary" id="resources" tabIndex={-1}>
          <DetailsPanel service={selectedService} language={language} onClose={handleClearSelection} />
        </aside>
      </main>
      <footer className="footer" id="site-footer" tabIndex={-1}>
        <div className="wrap footer__inner">
          <strong>{COPY.footerRights[language]}</strong>
          <span>{COPY.footerTagline[language]}</span>
        </div>
      </footer>
    </div>
  );
}
