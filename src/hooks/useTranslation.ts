import { useOutletContext } from "react-router-dom";
import { i18n } from "../i18n";

type Lang = keyof typeof i18n;
export type TranslationKey = keyof (typeof i18n)["uk"];
export type TranslationFn = (key: TranslationKey) => string;

export function useTranslation() {
  const { lang } = useOutletContext<{ lang: Lang }>();

  const t: TranslationFn = (key) => {
    return i18n[lang][key];
  };

  return { t, lang };
}
