import type { LanguageCode } from '../types/catalog';
import { COPY } from '../lib/copy';

interface LanguageToggleProps {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
}

const LANGUAGE_OPTIONS: LanguageCode[] = ['ua', 'en'];

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="segmented-control" role="group" aria-label={COPY.languageToggleLabel[value]}>
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className="segmented-control__button"
          aria-pressed={value === option}
          aria-label={option === 'ua' ? COPY.languageToggleOptionUa[value] : COPY.languageToggleOptionEn[value]}
          title={option === 'ua' ? COPY.languageToggleOptionUa[value] : COPY.languageToggleOptionEn[value]}
          onClick={() => onChange(option)}
        >
          <span aria-hidden>{option.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
