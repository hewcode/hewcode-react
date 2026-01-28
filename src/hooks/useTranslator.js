import { useLocaleContext } from '../contexts/locale-context.js';

let translator = null;

export default function useTranslator() {
  const { messages, locale } = useLocaleContext();

  translator = (key, params = {}) => {
    let translation = messages[key] || key;
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
      translation = translation.replace(`:${param}`, params[param]);
    });
    return translation;
  };

  return {
    __: translator,
    locale: locale,
  };
}
