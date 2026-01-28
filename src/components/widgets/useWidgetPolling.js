import { useEffect, useState } from 'react';
import useRoute from '../../hooks/use-route.ts';
import useFetch from '../../hooks/useFetch.js';

/**
 * Hook to poll for widget updates
 * @param {Object} params
 * @param {string} params.name - Widget name
 * @param {number|null} params.refreshInterval - Refresh interval in milliseconds
 * @param {Object} params.seal - Seal object for authentication
 * @param {Function} params.onUpdate - Callback when widget data updates
 */
export default function useWidgetPolling({ name, path, refreshInterval, seal, onUpdate }) {
  const [isPolling, setIsPolling] = useState(false);
  const { fetch } = useFetch();
  const route = useRoute();

  useEffect(() => {
    if (!refreshInterval || !seal || !name) {
      return;
    }

    setIsPolling(true);

    const interval = setInterval(() => {
      fetch(
        route('hewcode.mount'),
        {
          method: 'POST',
          body: {
            seal,
            call: {
              name: 'mount',
              params: {
                name: path,
              },
            },
          },
          onSuccess: (data) => {
            onUpdate(data);
          },
          onError: (errors) => {
            // Silently handle errors
          },
        },
        true, // skipValidation
      );
    }, refreshInterval);

    return () => {
      clearInterval(interval);
      setIsPolling(false);
    };
  }, [name, refreshInterval, seal, onUpdate, fetch, route]);

  return { isPolling };
}
