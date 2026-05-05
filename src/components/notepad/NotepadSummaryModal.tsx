import type { TranslationFn } from "../../hooks/useTranslation";

type Props = {
  tabs: readonly string[];
  summary: Record<string, number>;
  t: TranslationFn;
  onClose: () => void;
};

export default function NotepadSummaryModal({
  tabs,
  summary,
  t,
  onClose,
}: Props) {
  const total = tabs.reduce((sum, tab) => sum + (summary[tab] ?? 0), 0);

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="confirm-dialog notepad-summary-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="confirm-title">{t("notepadSummaryTitle")}</p>

        {total === 0 ? (
          <p className="notepad-summary-empty">{t("notepadSummaryEmpty")}</p>
        ) : (
          <div className="notepad-summary-list">
            {tabs.map((tab) => (
              <div key={tab} className="notepad-summary-row">
                <span className="notepad-summary-tab">{tab}</span>
                <span className="notepad-summary-dash">—</span>
                <span className="notepad-summary-count">{summary[tab] ?? 0}</span>
                <span className="notepad-summary-unit">{t("notepadTasksUnit")}</span>
              </div>
            ))}
            <div className="notepad-summary-total">
              🔥 {t("notepadSummaryTotal")}: {total} {t("notepadTasksUnit")}
            </div>
          </div>
        )}

        <button className="btn-secondary notepad-summary-close" onClick={onClose}>
          {t("notepadSummaryClose")}
        </button>
      </div>
    </div>
  );
}
