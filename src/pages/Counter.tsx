import { useState, useEffect } from "react";
import { i18n } from "../i18n";
import { useOutletContext } from "react-router-dom";

type Lang = keyof typeof i18n;
type TranslationKey = keyof (typeof i18n)["uk"];

export default function Counter() {
  const { lang, setLang: _setLang } = useOutletContext<{
    lang: Lang;
    setLang: (lang: Lang) => void;
  }>();
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const [copied, setCopied] = useState(false);

  const t = (key: TranslationKey) => i18n[lang][key];

  // 💾 сохранение текста
  useEffect(() => {
    const saved = localStorage.getItem("counter_text");
    if (saved) setText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("counter_text", text);
  }, [text]);

  // 🔴 LIVE (для stats)
  const liveLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const liveLong = liveLines.filter((l) => l.length > 20);

  const liveFreq = liveLines.reduce<Record<string, number>>((acc, l) => {
    const key = l.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const liveDup = Object.values(liveFreq).filter((v) => v > 1);

  // 🟢 RESULT (после кнопки)
  const lines = submittedText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const longLines = lines.filter((l) => l.length > 20);

  const freq = lines.reduce<Record<string, number>>((acc, l) => {
    const key = l.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const duplicates = Object.entries(freq).filter(([, v]) => v > 1);

  // 📋 copy
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="container">
      {/* TEXTAREA */}
      <div className="textarea-wrap">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          spellCheck={false}
        />
      </div>

      {/* STATS (live) */}
      <div className="stats-bar">
        <div className="stat-pill">
          <span className="stat-label">{t("lines")}</span>
          <span className="stat-value">{liveLines.length}</span>
        </div>

        <div className="stat-pill">
          <span className="stat-label">{t("tooLongStat")}</span>
          <span className="stat-value" style={{ color: "var(--accent2)" }}>
            {liveLong.length}
          </span>
        </div>

        <div className="stat-pill">
          <span className="stat-label">{t("duplicates")}</span>
          <span className="stat-value" style={{ color: "var(--accent-dup)" }}>
            {liveDup.length}
          </span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="buttons">
        <button className="btn-primary" onClick={() => setSubmittedText(text)}>
          {t("count")}
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            setText("");
            setSubmittedText("");
          }}
        >
          {t("clear")}
        </button>
      </div>

      {/* RESULT */}
      {submittedText && (
        <div id="output">
          {lines.length === 0 ? (
            <div className="empty">{t("emptyState")}</div>
          ) : (
            <>
              {/* список */}
              {lines.map((line, i) => {
                const isLong = line.length > 20;
                const isDup = freq[line.toLowerCase()] > 1;

                return (
                  <div
                    key={i}
                    className={`result-line ${isLong ? "too-long" : ""} ${
                      isDup ? "is-dup" : ""
                    }`}
                  >
                    <span className="line-text">{line}</span>

                    <span
                      className={`line-count ${
                        isLong ? "count-bad" : isDup ? "count-dup" : "count-ok"
                      }`}
                    >
                      {line.length} {t("chars")}
                    </span>

                    <button
                      className="line-copy-btn"
                      onClick={() => handleCopy(line)}
                    >
                      ⎘
                    </button>
                  </div>
                );
              })}

              {/* длинные */}
              {longLines.length > 0 && (
                <div className="toolong-section">
                  <div className="toolong-header">
                    <span>{t("tooLongTitle")}</span>
                    <button
                      className="toolong-copy-btn"
                      onClick={() => handleCopy(longLines.join("\n"))}
                    >
                      {t("copy")}
                    </button>
                  </div>

                  {longLines.map((l, i) => (
                    <div key={i} className="result-line too-long">
                      <span className="line-text">{l}</span>
                      <span className="line-count count-bad">
                        {l.length} {t("chars")}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* дубликаты */}
              <div className="toolong-section">
                <div className="toolong-header">
                  <span>{t("dupTitle")}</span>
                  <button
                    className="toolong-copy-btn"
                    onClick={() => {
                      const unique = lines.filter(
                        (l, i, arr) =>
                          freq[l.toLowerCase()] > 1 &&
                          arr.findIndex(
                            (x) => x.toLowerCase() === l.toLowerCase(),
                          ) === i,
                      );
                      handleCopy(unique.join("\n"));
                    }}
                  >
                    {t("copy")}
                  </button>
                </div>

                {duplicates.length > 0 ? (
                  duplicates.map(([key, count], i) => {
                    const original =
                      lines.find((l) => l.toLowerCase() === key) || key;

                    return (
                      <div key={i} className="result-line is-dup">
                        <span className="line-text">{original}</span>
                        <span className="dup-count-badge">×{count}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty">{t("noMatches")}</div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* TOAST */}
      {copied && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--surface)",
            padding: "10px 16px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            fontSize: 12,
          }}
        >
          {t("copied")}
        </div>
      )}
    </div>
  );
}
