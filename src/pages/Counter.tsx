import { useState, useEffect } from "react";

import TextareaBlock from "../components/counter/TextareaBlock";
import StatsBar from "../components/counter/StatsBar";
import ResultList from "../components/counter/ResultList";
import CopyToast from "../components/counter/CopyToast";

import { useTranslation } from "../hooks/useTranslation";

export default function Counter() {
  const { t } = useTranslation();

  const [text, setText] = useState(
    () => localStorage.getItem("counter_text") ?? ""
  );
  const [submittedText, setSubmittedText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("counter_text", text);
  }, [text]);

  // 🔴 НОРМАЛИЗАЦИЯ (единая база)
  const lines = submittedText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // 🔥 частоты (единственный источник истины)
  const freq = lines.reduce<Record<string, number>>((acc, l) => {
    const key = l.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // 🔴 длинные строки
  const longLines = lines.filter((l) => l.length > 20);

  // 🔴 live stats (для textarea)
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

  // 📋 copy
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <>
      {/* TEXTAREA */}
      <TextareaBlock
        text={text}
        setText={setText}
        placeholder={t("placeholder")}
      />

      {/* STATS */}
      <StatsBar
        lines={liveLines.length}
        long={liveLong.length}
        dup={liveDup.length}
        t={t}
      />

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
          <ResultList
            lines={lines}
            longLines={longLines}
            freq={freq}
            t={t}
            handleCopy={handleCopy}
          />
        </div>
      )}

      {/* TOAST */}
      <CopyToast show={copied} text={t("copied")} />
    </>
  );
}
