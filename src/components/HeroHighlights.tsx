import type { CSSProperties, ReactElement } from 'react';

type HeroHighlightIcon = 'map' | 'spark' | 'layers';

export interface HeroHighlightItem {
  id: string;
  title: string;
  description: string;
  icon: HeroHighlightIcon;
}

interface HeroHighlightsProps {
  items: HeroHighlightItem[];
  preview: {
    badge: string;
    title: string;
    caption: string;
  };
}

const ICONS: Record<HeroHighlightIcon, ReactElement> = {
  map: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3.75 6.75 9 4.5l6 3 5.25-2.25v12l-5.25 2.25-6-3-5.25 2.25v-12Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4.5v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7.5v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 12 12 15.75 19.5 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 8.25 12 12 19.5 8.25 12 4.5 4.5 8.25Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15.75 12 19.5 19.5 15.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.75v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 15.75v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4.5 12h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 12h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m6.6 6.6 3.182 3.182" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m14.218 14.218 3.182 3.182" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m6.6 17.4 3.182-3.182" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m14.218 9.782 3.182-3.182" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </svg>
  ),
};

export function HeroHighlights({ items, preview }: HeroHighlightsProps) {
  return (
    <div className="hero-showcase">
      <div className="hero-highlights" role="list">
        {items.map((item, index) => {
          const delay = `${0.12 * (index + 1)}s`;
          const style: CSSProperties = { animationDelay: delay };
          return (
            <article key={item.id} className="hero-highlight" role="listitem" style={style}>
              <div className="hero-highlight__icon" aria-hidden="true">
                {ICONS[item.icon]}
              </div>
              <div className="hero-highlight__content">
                <h3 className="hero-highlight__title">{item.title}</h3>
                <p className="hero-highlight__description">{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
      <article className="hero-preview" style={{ animationDelay: `${0.12 * (items.length + 1)}s` }}>
        <span className="hero-preview__badge">{preview.badge}</span>
        <p className="hero-preview__title">{preview.title}</p>
        <p className="hero-preview__caption">{preview.caption}</p>
        <div className="hero-preview__screen" aria-hidden="true">
          <span className="hero-preview__pulse" />
          <div className="hero-preview__rows">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="hero-preview__chart">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </article>
    </div>
  );
}

