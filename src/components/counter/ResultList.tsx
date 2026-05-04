import { useState } from "react";
import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  lines: string[];
  longLines: string[];
  freq: Record<string, number>;
  t: TranslationFn;
  handleCopy: (v: string) => void;
};

export default function ResultList({
  lines,
  longLines,
  freq,
  t,
  handleCopy,
}: Props) {
  const [copiedBlock, setCopiedBlock] = useState<null | "long" | "dup">(null);
  const [copiedLine, setCopiedLine] = useState<string | null>(null);

  if (!lines.length) {
    return <div className="empty">{t("emptyState")}</div>;
  }

  // ✅ единая логика дублей
  const uniqueDups = Object.keys(freq)
    .filter((key) => freq[key] > 1)
    .map((key) => lines.find((l) => l.toLowerCase() === key)!);

  const hasDuplicates = uniqueDups.length > 0;

  const copyBlock = (type: "long" | "dup", data: string[]) => {
    if (!data.length) return;

    handleCopy(data.join("\n"));
    setCopiedBlock(type);
    setTimeout(() => setCopiedBlock(null), 1200);
  };

  const copyLine = (line: string) => {
    handleCopy(line);
    setCopiedLine(line);
    setTimeout(() => setCopiedLine(null), 1200);
  };

  return (
    <>
      {/* 🟡 DUPLICATES — ВСЕГДА ПЕРВЫЕ */}
      <div className="toolong-section">
        <div className="toolong-header" style={{ color: "var(--accent-dup)" }}>
          <span>{t("dupTitle")}</span>

          {hasDuplicates && (
            <button
              className="toolong-copy-btn"
              style={{
                color: "var(--accent-dup)",
                borderColor: "rgba(255,180,0,0.3)",
                background: "rgba(255,180,0,0.1)",
              }}
              onClick={() => copyBlock("dup", uniqueDups)}
            >
              {copiedBlock === "dup" ? "✓" : t("copy")}
            </button>
          )}
        </div>

        <div id="dupList">
          {hasDuplicates ? (
            uniqueDups.map((line, i) => (
              <div key={i} className="result-line is-dup">
                <span className="line-text">{line}</span>
                <span className="dup-count-badge">
                  ×{freq[line.toLowerCase()]}
                </span>

                <button
                  className="line-copy-btn"
                  onClick={() => copyLine(line)}
                >
                  {copiedLine === line ? "✓" : "⎘"}
                </button>
              </div>
            ))
          ) : (
            <div className="empty">{t("noMatches")}</div>
          )}
        </div>
      </div>

      {/* 🔴 LONG — ВТОРЫЕ */}
      {longLines.length > 0 && (
        <div className="toolong-section">
          <div className="toolong-header">
            <span>{t("tooLongTitle")}</span>

            <button
              className="toolong-copy-btn"
              onClick={() => copyBlock("long", longLines)}
            >
              {copiedBlock === "long" ? "✓" : t("copy")}
            </button>
          </div>

          <div id="toolongList">
            {longLines.map((line, i) => (
              <div key={i} className="result-line too-long">
                <span className="line-text">{line}</span>

                <span className="line-count count-bad">
                  {line.length} {t("chars")}
                </span>

                <button
                  className="line-copy-btn"
                  onClick={() => copyLine(line)}
                >
                  {copiedLine === line ? "✓" : "⎘"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 ВСЕ СТРОКИ — ВНИЗУ */}
      <div id="resultList">
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

              <button className="line-copy-btn" onClick={() => copyLine(line)}>
                {copiedLine === line ? "✓" : "⎘"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
