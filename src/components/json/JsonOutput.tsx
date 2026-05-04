import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  json: string;
  t: TranslationFn;
  onCopy: () => void;
};

export default function JsonOutput({ json, t, onCopy }: Props) {
  if (!json) return null;

  const parsed = JSON.parse(json);

  return (
    <div className="json-output">
      <div className="json-meta">
        <span className="json-header-label">{t("result")}</span>
        <span className="json-count-badge">
          {parsed.length} {t("objects")}
        </span>
      </div>

      <textarea
        value={json}
        readOnly
        className="json-textarea"
        spellCheck={false}
      />

      <div className="buttons" style={{ marginTop: "12px" }}>
        <button className="btn-primary" onClick={onCopy}>
          {t("copyJson")}
        </button>
      </div>
    </div>
  );
}
