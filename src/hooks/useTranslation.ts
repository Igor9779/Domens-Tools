import { useOutletContext } from "react-router-dom";
import { i18n } from "../i18n";

type Lang = keyof typeof i18n;
type TranslationKey = keyof (typeof i18n)["uk"];

export function useTranslation() {
  const { lang } = useOutletContext<{ lang: Lang }>();

  const t = (key: TranslationKey): string => {
    return i18n[lang][key];
  };

  return { t, lang };
}
