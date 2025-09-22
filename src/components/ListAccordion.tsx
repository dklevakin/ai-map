import { useMemo } from 'react';
import type {
  CatalogCategory,
  LanguageCode,
  ServiceEntry,
  ServiceGroup,
  ServiceResourceEntry,
} from '../types/catalog';
import { COPY } from '../lib/copy';
import { buildCompositeKey, findResourceEntry, isGroup, makeServiceKey } from '../lib/catalog';
import { ServiceLogo } from './ServiceLogo';

interface ListAccordionProps {
  categories: CatalogCategory[];
  language: LanguageCode;
  searchQuery: string;
  selectedServiceKey: string | null;
  expandedCategory: number | null;
  expandedGroups: Map<string, Set<string>>;
  resources: Map<string, ServiceResourceEntry> | null;
  onToggleCategory: (index: number) => void;
  onToggleGroup: (categoryIndex: number, groupName: string) => void;
  onSelectService: (params: {
    service: ServiceEntry;
    category: CatalogCategory;
    group?: ServiceGroup | null;
    occurrence: number;
  }) => void;
}

function matchesQuery(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

export function ListAccordion({
  categories,
  language,
  searchQuery,
  selectedServiceKey,
  expandedCategory,
  expandedGroups,
  resources,
  onToggleCategory,
  onToggleGroup,
  onSelectService,
}: ListAccordionProps) {
  const query = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) {
      return categories.map((category, index) => ({
        category,
        index,
        entries: category.items,
      }));
    }
    return categories
      .map((category, index) => {
        const items = category.items.flatMap((item) => {
          if (isGroup(item)) {
            const matchedServices = item.items.filter(
              (svc) => matchesQuery(svc.name, query) || matchesQuery(svc.desc, query),
            );
            if (matchesQuery(item.group, query) || matchedServices.length > 0) {
              return [{ ...item, items: matchedServices.length ? matchedServices : item.items }];
            }
            return [];
          }
          if (matchesQuery(item.name, query) || matchesQuery(item.desc, query)) {
            return [item];
          }
          return [];
        });
        return items.length > 0
          ? {
              category,
              index,
              entries: items,
            }
          : null;
      })
      .filter(Boolean) as { category: CatalogCategory; index: number; entries: (ServiceEntry | ServiceGroup)[] }[];
  }, [categories, query]);

  if (filtered.length === 0) {
    return <p className="map-note">{COPY.noResults[language]}</p>;
  }

  const occurrenceRegistry = new Map<string, number>();

  const resolveOccurrence = (service: ServiceEntry) => {
    const id = makeServiceKey(service);
    const current = occurrenceRegistry.get(id) || 0;
    occurrenceRegistry.set(id, current + 1);
    return current;
  };

  const isGroupExpanded = (index: number, groupName: string) => {
    const key = `${index}`;
    const entry = expandedGroups.get(key);
    return entry ? entry.has(groupName) : false;
  };

  return (
    <div className="accordion" aria-live="polite">
      {filtered.map(({ category, index, entries }) => {
        const isExpanded = expandedCategory === index || !!query;
        return (
          <section key={category.category} className="accordion__section">
            <button
              type="button"
              className="accordion__summary"
              aria-expanded={isExpanded}
              onClick={() => onToggleCategory(index)}
              style={{ borderColor: category.color }}
            >
              <span>{category.category}</span>
              <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
            </button>
            {isExpanded && (
              <div className="accordion__content">
                {entries.map((entry) => {
                  if (isGroup(entry)) {
                    const groupExpanded = isGroupExpanded(index, entry.group);
                    const displayServices = groupExpanded || !!query
                      ? entry.items
                      : [];
                    return (
                      <div key={entry.group}>
                        <button
                          type="button"
                          className="accordion__summary"
                          aria-expanded={groupExpanded}
                          onClick={() => onToggleGroup(index, entry.group)}
                          style={{ borderColor: category.color, fontSize: '15px' }}
                        >
                          <span>{entry.group}</span>
                          <span aria-hidden="true">{groupExpanded ? '−' : '+'}</span>
                        </button>
                        {groupExpanded && (
                          <div className="accordion__content">
                            {entry.items.map((svc) => renderServiceCard({
                              category,
                              service: svc,
                              group: entry,
                              language,
                              resources,
                              selectedServiceKey,
                              onSelectService,
                              occurrence: resolveOccurrence(svc),
                            }))}
                          </div>
                        )}
                        {!groupExpanded && query && (
                          <div className="accordion__content">
                            {displayServices.map((svc) => renderServiceCard({
                              category,
                              service: svc,
                              group: entry,
                              language,
                              resources,
                              selectedServiceKey,
                              onSelectService,
                              occurrence: resolveOccurrence(svc),
                            }))}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return renderServiceCard({
                    category,
                    service: entry,
                    language,
                    resources,
                    selectedServiceKey,
                    onSelectService,
                    occurrence: resolveOccurrence(entry),
                  });
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

interface RenderServiceCardArgs {
  category: CatalogCategory;
  service: ServiceEntry;
  group?: ServiceGroup;
  language: LanguageCode;
  resources: Map<string, ServiceResourceEntry> | null;
  selectedServiceKey: string | null;
  onSelectService: (params: {
    service: ServiceEntry;
    category: CatalogCategory;
    group?: ServiceGroup | null;
    occurrence: number;
  }) => void;
  occurrence: number;
}

function renderServiceCard({
  category,
  service,
  group,
  language,
  resources,
  selectedServiceKey,
  onSelectService,
  occurrence,
}: RenderServiceCardArgs) {
  const serviceId = makeServiceKey(service);
  const serviceKey = buildCompositeKey(serviceId, occurrence);
  const isSelected = selectedServiceKey === serviceKey;
  const resourceEntry = resources ? findResourceEntry(resources, service) : undefined;

  return (
    <article key={serviceKey} className="accordion__service" style={{ borderColor: category.color }}>
      <div className="accordion__service-header">
        <span className="service-chip__logo" aria-hidden="true">
          <ServiceLogo href={service.href} name={service.name} />
        </span>
        <h4 className="accordion__service-title">{service.name}</h4>
      </div>
      <p className="details__description">{service.desc}</p>
      {resourceEntry?.tags && (
        <div className="details__tags">
          {resourceEntry.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="accordion__service-actions">
        <a href={service.href} target="_blank" rel="noreferrer">
          {COPY.detailsPrimary[language]}
        </a>
        <button
          type="button"
          className="control-button"
          aria-pressed={isSelected}
          onClick={() =>
            onSelectService({
              service,
              category,
              group: group || null,
              occurrence,
            })
          }
        >
          {COPY.detailsRegion[language]}
        </button>
      </div>
    </article>
  );
}
