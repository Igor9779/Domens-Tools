import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { i18n } from "../i18n";

type Lang = keyof typeof i18n;
type TranslationKey = keyof (typeof i18n)["uk"];

export default function JsonCreator() {
  const { lang, setLang } = useOutletContext<{
    lang: Lang;
    setLang: (lang: Lang) => void;
  }>();
  const [text, setText] = useState("");
  const [json, setJson] = useState("");

  const t = (key: TranslationKey) => i18n[lang][key];

  // строки
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // создание JSON
  const handleCreate = () => {
    if (!lines.length) {
      setJson("");
      return;
    }

    const objects = lines.reduce<any[]>((acc, line) => {
      const parts = line.split(/\s[-–—]\s/);

      if (parts.length >= 3) {
        acc.push({
          domain: parts[0].trim(),
          name_theme: parts.slice(1, -1).join(" – ").trim(),
          brand_name: parts[parts.length - 1].trim(),
        });
      }

      return acc;
    }, []);

    setJson(JSON.stringify(objects, null, 2));
  };

  // копирование JSON
  const handleCopy = () => {
    if (!json) return;

    navigator.clipboard.writeText(json);
  };

  return (
    <div className="container">
      {/* TEXTAREA */}
      <div className="textarea-wrap">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("jsonPlaceholder")}
          spellCheck={false}
        />
      </div>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat-pill">
          <span className="stat-label">{t("lines")}</span>
          <span className="stat-value">{lines.length}</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn-primary" onClick={handleCreate}>
          {t("create")}
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            setText("");
            setJson("");
          }}
        >
          {t("clear")}
        </button>
      </div>

      {/* OUTPUT */}
      {json && (
        <div className="json-output">
          <div className="json-meta">
            <span className="json-header-label">{t("result")}</span>
            <span className="json-count-badge">
              {JSON.parse(json).length} {t("objects")}
            </span>
          </div>

          <textarea
            value={json}
            readOnly
            className="json-textarea"
            spellCheck={false}
          />

          <div className="buttons" style={{ marginTop: "12px" }}>
            <button className="btn-primary" onClick={handleCopy}>
              {t("copyJson")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
