import { useCallback, useRef, useState } from 'react';

/**
 * Custom hook for throttled search with API integration
 * Prevents excessive API calls while user is typing
 * @param onSearch - Callback function to execute after throttle delay
 * @param delay - Throttle delay in milliseconds (default: 500ms)
 */
export function useThrottledSearch(
  onSearch: (searchTerm: string) => void,
  delay: number = 500
) {
  const [searchTerm, setSearchTerm] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);

      // Clear previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for throttled search
      timeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, delay);
    },
    [onSearch, delay]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearch('');
  }, [onSearch]);

  return {
    searchTerm,
    handleSearch,
    clearSearch,
  };
}
