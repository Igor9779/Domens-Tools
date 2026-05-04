import { useState } from "react";

import JsonTextarea from "../components/json/JsonTextarea";
import JsonStats from "../components/json/JsonStats";
import JsonOutput from "../components/json/JsonOutput";

import { useTranslation } from "../hooks/useTranslation";

type JsonEntry = {
  domain: string;
  name_theme: string;
  brand_name: string;
};

export default function JsonCreator() {
  const { t } = useTranslation();

  const [text, setText] = useState("");
  const [json, setJson] = useState("");

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

    const objects = lines.reduce<JsonEntry[]>((acc, line) => {
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

  // копирование
  const handleCopy = () => {
    if (!json) return;
    navigator.clipboard.writeText(json);
  };

  return (
    <>
      <JsonTextarea
        text={text}
        setText={setText}
        placeholder={t("jsonPlaceholder")}
      />

      <JsonStats count={lines.length} t={t} />

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

      <JsonOutput json={json} t={t} onCopy={handleCopy} />
    </>
  );
}
