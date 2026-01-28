import { useCallback } from 'react';
import { useHewcode } from '../contexts/hewcode-context.jsx';

export default function useRoute() {
  const { hewcode } = useHewcode();

  return useCallback(
    function (name: string, params: Record<string, string> = {}) {
      const routes = hewcode?.routes || {};
      const url = routes[name] || null;

      if (!url) {
        throw new Error(`Route not found: ${name}`);
      }

      let compiledUrl = url;

      Object.keys(params).forEach((key) => {
        const value = encodeURIComponent(params[key]);
        compiledUrl = compiledUrl.replace(`{${key}}`, value);
      });

      return compiledUrl;
    },
    [hewcode],
  );
}
