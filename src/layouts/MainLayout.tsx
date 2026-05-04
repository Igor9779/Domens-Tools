import { NavLink, Outlet } from "react-router-dom";
import { i18n } from "../i18n";
import { useState, useEffect } from "react";

type Lang = keyof typeof i18n;
type TranslationKey = keyof (typeof i18n)["uk"];

const STORAGE_KEY = "app_lang";

export default function MainLayout() {
  // 🔥 правильная инициализация из localStorage
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in i18n) {
      return saved as Lang;
    }
    return "uk";
  });

  const t = (key: TranslationKey) => i18n[lang][key];

  // 💾 сохраняем язык
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  return (
    <div className="container">
      {/* HEADER */}
      <div className="header">
        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `app-nav-link ${isActive ? "active" : ""}`
            }
          >
            {t("navCounter")}
            <br />
            <span>{t("navCounterSub")}</span>
          </NavLink>

          <NavLink
            to="/json"
            className={({ isActive }) =>
              `app-nav-link ${isActive ? "active" : ""}`
            }
          >
            {t("navJson")}
            <br />
            <span>{t("navJsonSub")}</span>
          </NavLink>
        </nav>

        <div className="lang-switcher">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
          >
            <option value="uk">🇺🇦 UA</option>
            <option value="en">🇬🇧 EN</option>
            <option value="ru">🇷🇺 RU</option>
          </select>
        </div>
      </div>

      {/* PAGE CONTENT */}
      <Outlet context={{ lang, setLang }} />
    </div>
  );
}
