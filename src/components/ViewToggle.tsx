import type { LanguageCode } from '../types/catalog';
import type { ViewMode } from '../types/ui';
import { COPY } from '../lib/copy';

interface ViewToggleProps {
  value: ViewMode;
  language: LanguageCode;
  onChange: (mode: ViewMode) => void;
}

function MapIcon() {
  return (
    <svg className="view-toggle__icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        fill="currentColor"
        d="M9 3.49 3 5.7v14.81l6-2.21l6 2.21l6-2.21V3.49l-6 2.21Zm5.5 1.84l4-1.48v13.82l-4 1.48ZM4.5 7.33l4-1.48v13.82l-4 1.48Zm5.5-.37l4 1.48v13.82l-4-1.48Z"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="view-toggle__icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        fill="currentColor"
        d="M4 6a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm5-2a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1Zm0 6a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H10a1 1 0 0 1-1-1ZM4 12a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm0 6a2 2 0 1 1 0-4a2 2 0 0 1 0 4Z"
      />
    </svg>
  );
}

export function ViewToggle({ value, language, onChange }: ViewToggleProps) {
  return (
    <div className="view-toggle" role="group" aria-label={COPY.viewModeLabel[language]}>
      <button
        type="button"
        className="view-toggle__button"
        aria-pressed={value === 'map'}
        aria-label={COPY.viewModeMapDescription[language]}
        title={COPY.viewModeMapDescription[language]}
        onClick={() => onChange('map')}
      >
        <MapIcon />
        <span className="view-toggle__text">{COPY.viewMap[language]}</span>
      </button>
      <button
        type="button"
        className="view-toggle__button"
        aria-pressed={value === 'list'}
        aria-label={COPY.viewModeListDescription[language]}
        title={COPY.viewModeListDescription[language]}
        onClick={() => onChange('list')}
      >
        <ListIcon />
        <span className="view-toggle__text">{COPY.viewList[language]}</span>
      </button>
    </div>
  );
}
