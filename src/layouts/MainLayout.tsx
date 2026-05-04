import { NavLink, Outlet } from "react-router-dom";
import { i18n } from "../i18n";
import { useState } from "react";

type Lang = keyof typeof i18n;

export default function MainLayout() {
  const [lang, setLang] = useState<Lang>("uk");

  return (
    <div className="container">
      <div className="header">
        <nav className="app-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `app-nav-link ${isActive ? "active" : ""}`
            }
          >
            Лічильник
            <br />
            <span>символів</span>
          </NavLink>

          <NavLink
            to="/json"
            className={({ isActive }) =>
              `app-nav-link ${isActive ? "active" : ""}`
            }
          >
            Json-файл
            <br />
            <span>для генератора</span>
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
