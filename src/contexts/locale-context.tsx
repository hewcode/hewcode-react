import { createContext, ReactNode, useContext } from 'react';
import { useHewcode } from './hewcode-context';

interface LocaleData {
  messages: Record<string, string>;
  lang: string;
}

interface LocaleContextType {
  messages: Record<string, string>;
  locale: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  locale: LocaleData | any; // Allow any to handle Inertia props
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const locale = useHewcode().hewcode?.locale;

  if (!locale) {
    throw new Error('Locale data is not available in Hewcode context');
  }

  const value = {
    messages: locale.messages,
    locale: locale.lang,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocaleContext must be used within a LocaleProvider');
  }
  return context;
}
