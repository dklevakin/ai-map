import type { LanguageCode } from '../types/catalog';
import type { ThemeMode } from '../types/ui';
import { COPY } from '../lib/copy';

interface ThemeToggleProps {
  value: ThemeMode;
  language: LanguageCode;
  onChange: (mode: ThemeMode) => void;
}

function MoonIcon() {
  return (
    <svg className="segmented-control__icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        fill="currentColor"
        d="M21 14.27A9 9 0 0 1 9.73 3 7 7 0 1 0 21 14.27Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="segmented-control__icon" aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 1-1h0a1 1 0 1 1-2 0h0a1 1 0 0 1 1-1ZM6.22 6.22a1 1 0 0 1 1.41-1.41h0a1 1 0 1 1-1.41 1.41Zm11.56 0a1 1 0 1 1 1.41-1.41h0a1 1 0 0 1-1.41 1.41ZM12 7a5 5 0 1 1 0 10a5 5 0 0 1 0-10Zm8 5a1 1 0 0 1 1-1h0a1 1 0 1 1 0 2h0a1 1 0 0 1-1-1Zm-1.81 7.19a1 1 0 1 1 1.41 1.41h0a1 1 0 1 1-1.41-1.41ZM4 12a1 1 0 1 1-2 0h0a1 1 0 0 1 2 0Zm2.22 6.78a1 1 0 1 1-1.41 1.41h0a1 1 0 0 1 1.41-1.41ZM12 20a1 1 0 0 1 1 1h0a1 1 0 1 1-2 0h0a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}

export function ThemeToggle({ value, language, onChange }: ThemeToggleProps) {
  return (
    <div className="segmented-control" role="group" aria-label={COPY.themeToggleLabel[language]}>
      <button
        type="button"
        className="segmented-control__button"
        aria-pressed={value === 'dark'}
        aria-label={COPY.themeToggleDark[language]}
        title={COPY.themeToggleDark[language]}
        onClick={() => onChange('dark')}
      >
        <MoonIcon />
        <span className="segmented-control__text">{COPY.themeDark[language]}</span>
      </button>
      <button
        type="button"
        className="segmented-control__button"
        aria-pressed={value === 'light'}
        aria-label={COPY.themeToggleLight[language]}
        title={COPY.themeToggleLight[language]}
        onClick={() => onChange('light')}
      >
        <SunIcon />
        <span className="segmented-control__text">{COPY.themeLight[language]}</span>
      </button>
    </div>
  );
}
