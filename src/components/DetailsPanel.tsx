import type { EnrichedService, LanguageCode, ResourceLink } from '../types/catalog';
import { COPY } from '../lib/copy';

interface DetailsPanelProps {
  service?: EnrichedService | null;
  language: LanguageCode;
  onClose: () => void;
}

function normalizeLinks(links: unknown): ResourceLink[] {
  if (!links) return [];
  if (typeof links === 'string') {
    return [{ href: links }];
  }
  if (Array.isArray(links)) {
    return links.flatMap((item) => normalizeLinks(item));
  }
  const entry = links as ResourceLink;
  if (!entry.href) return [];
  return [entry];
}

export function DetailsPanel({ service, language, onClose }: DetailsPanelProps) {
  if (!service) {
    return (
      <div className="details" aria-label={COPY.detailsRegion[language]}>
        <p className="details__empty">{COPY.detailsEmpty[language]}</p>
      </div>
    );
  }

  const { categoryName, groupName, desc, href, name, resources } = service;
  const metaLines = [categoryName, groupName].filter(Boolean);

  const primaryLabel = COPY.detailsPrimary[language];
  const linkGroups = resources?.links || {};
  const entries = Object.entries(linkGroups).flatMap(([key, value]) => {
    const list = normalizeLinks(value);
    return list.map((item) => ({
      key,
      href: item.href,
      label:
        typeof item.label === 'string'
          ? item.label
          : item.label?.[language] || item.label?.en || item.label?.ua || undefined,
    }));
  });

  return (
    <div className="details" aria-label={COPY.detailsRegion[language]}>
      <button type="button" className="details__close" onClick={onClose}>
        {COPY.detailsClose[language]}
      </button>
      <div>
        <h3 className="details__title">{name}</h3>
        {metaLines.length > 0 && (
          <div className="details__meta">
            {metaLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        )}
      </div>
      <p className="details__description">{desc}</p>
      {resources?.tags && resources.tags.length > 0 && (
        <div>
          <p className="details__meta">{COPY.detailsTagsLabel[language]}</p>
          <div className="details__tags">
            {resources.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {entries.length > 0 && (
        <div className="details__links">
          <p className="details__meta">{COPY.detailsLinksLabel[language]}</p>
          {entries.map((entry, index) => (
            <a
              key={`${entry.key}-${index}`}
              className="details__link"
              href={entry.href}
              target="_blank"
              rel="noreferrer"
            >
              <span>{entry.label || entry.href}</span>
            </a>
          ))}
        </div>
      )}
      <a
        className="details__primary"
        href={href}
        target="_blank"
        rel="noreferrer"
        title={COPY.detailsPrimaryTitle[language]}
      >
        <span>{primaryLabel}</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
