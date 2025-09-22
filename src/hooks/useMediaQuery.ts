import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      return window.matchMedia(query).matches;
    } catch (error) {
      console.warn('Failed to evaluate media query', query, error);
      return false;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    let mq: MediaQueryList;
    try {
      mq = window.matchMedia(query);
    } catch (error) {
      console.warn('Failed to register media query listener', query, error);
      return;
    }

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mq.matches);

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    if (typeof mq.addListener === 'function') {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }

    return () => undefined;
  }, [query]);

  return matches;
}
