import type { TranslationFn } from "../../hooks/useTranslation";
import type { TabsData } from "./notepadUtils";

type Props = {
  tabs: readonly string[];
  data: TabsData;
  activeTab: string;
  totalTasks: number;
  isSendingReport: boolean;
  username: string;
  t: TranslationFn;
  onTabChange: (tab: string) => void;
  onSendReport: () => void;
  onAddTask: () => void;
  onShowSummary: () => void;
  onEditUsername: () => void;
  onClearAll: () => void;
};

export default function NotepadTabs({
  tabs,
  data,
  activeTab,
  totalTasks,
  isSendingReport,
  username,
  t,
  onTabChange,
  onSendReport,
  onAddTask,
  onShowSummary,
  onEditUsername,
  onClearAll,
}: Props) {
  return (
    <div className="notepad-tabs">
      {tabs.map((tab) => (
        <button
          key={tab}
          data-tab={tab}
          className={`notepad-tab ${activeTab === tab ? "active" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
          {(data[tab]?.length ?? 0) > 0 && (
            <span className="notepad-tab-badge">{data[tab].length}</span>
          )}
        </button>
      ))}

      <div className="notepad-total-pill" aria-live="polite">
        <span className="notepad-total-label">{t("notepadTotal")}</span>
        <span className="notepad-total-value">{totalTasks}</span>
      </div>

      <div className="notepad-toolbar-actions">
        {username && (
          <button
            className="notepad-username-chip"
            onClick={onEditUsername}
            title={t("notepadUsernameEditHint")}
          >
            {username}
          </button>
        )}
        <button
          className="notepad-summary-btn"
          onClick={onShowSummary}
          title={t("notepadSummaryBtn")}
        >
          📊
        </button>
        <button
          className="notepad-send-btn"
          onClick={onSendReport}
          disabled={isSendingReport}
        >
          {isSendingReport ? t("notepadReportSending") : t("notepadReportSend")}
        </button>
        <button
          className="notepad-clear-btn"
          onClick={onClearAll}
          title={t("notepadClearAll")}
        >
          🗑
        </button>
        <button
          className="notepad-add-btn"
          onClick={onAddTask}
          title={t("notepadAdd")}
        >
          +
        </button>
      </div>
    </div>
  );
}
