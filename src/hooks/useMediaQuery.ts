import { useEffect, useState } from 'react';

/**
 * Simple hook to subscribe to a window.matchMedia query.
 * Returns true whenever the media query matches.
*/

export function useMediaQuery(query: string): boolean {
  // On the server or first render, initialize to false
  const [matches, setMatches] = useState(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    // Clean up on unmount
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}