import { createContext, useContext, useState } from 'react';
import type { NavItem } from '../types';

type Hewcode = {
  routes: Record<string, string>;
  locale: Record<string, unknown>;
  icons: Record<string, string>;
  toasts: any[];
  panel: {
    name: string;
    title: string | null;
    layout: string;
    navigation: {
      icons: Record<string, string>;
      items: NavItem[];
    };
  };
  [key: string]: unknown;
};

type HewcodeContext = {
  hewcode: Hewcode | null;
  setHewcode: (hewcode: Hewcode) => void;
};

const HewcodeContext = createContext<HewcodeContext | null>(null);

export function HewcodeProvider({ children, initialHewcode }) {
  const [hewcode, setHewcodeState] = useState(initialHewcode);

  const setHewcode = (newState) => {
    setHewcodeState((prev) => {
      const next = typeof newState === 'function' ? newState(prev) : newState;

      if (prev?.icons || next?.icons) {
        return {
          ...next,
          icons: {
            ...(prev?.icons || {}),
            ...(next?.icons || {}),
          },
        };
      }

      return next;
    });
  };

  return <HewcodeContext.Provider value={{ hewcode, setHewcode }}>{children}</HewcodeContext.Provider>;
}

export function useHewcode(): HewcodeContext {
  const context = useContext(HewcodeContext);
  if (!context) {
    throw new Error('useHewcode must be used within a HewcodeProvider');
  }
  return context;
}
