import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

type Task = {
  id: string;
  name: string;
  content: string;
  expanded: boolean;
};

type TabsData = Record<string, Task[]>;

const TABS = ["2595", "2333", "3100"] as const;
const STORAGE_KEY = "notepad_data";
const REPORT_LOCALES = {
  uk: "uk-UA",
  en: "en-GB",
  ru: "ru-RU",
} as const;

function generateId() {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

const emptyData: TabsData = Object.fromEntries(TABS.map((tab) => [tab, []]));

export default function Notepad() {
  const { t, lang } = useTranslation();

  const [activeTab, setActiveTab] = useState<string>(TABS[0]);
  const [data, setData] = useState<TabsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...emptyData, ...JSON.parse(saved) };
    } catch {
      return { ...emptyData };
    }
    return { ...emptyData };
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!reportStatus) return;

    const timeoutId = window.setTimeout(() => {
      setReportStatus(null);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [reportStatus]);

  const tasks = data[activeTab] ?? [];
  const totalTasks = Object.values(data).reduce(
    (sum, tabTasks) => sum + tabTasks.length,
    0
  );

  const buildReport = (tabsData: TabsData) => {
    const formattedDate = new Intl.DateTimeFormat(REPORT_LOCALES[lang], {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date());

    const total = TABS.reduce(
      (sum, tab) => sum + (tabsData[tab]?.length ?? 0),
      0
    );

    return [
      `📊 ${t("notepadReportTitle")}:`,
      `${t("notepadReportDateLabel")}: ${formattedDate}`,
      "",
      ...TABS.map(
        (tab) => `${tab} - ${tabsData[tab]?.length ?? 0} ${t("notepadTasksUnit")}`
      ),
      "",
      `${t("notepadReportTotalLine")} - ${total}`,
    ].join("\n");
  };

  const addTask = () => {
    const newTask: Task = {
      id: generateId(),
      name: t("notepadDefaultName"),
      content: "",
      expanded: true,
    };
    setData((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] ?? []), newTask],
    }));
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((task) =>
        task.id === id ? { ...task, ...patch } : task
      ),
    }));
  };

  const deleteTask = (id: string) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((task) => task.id !== id),
    }));
    setConfirmDeleteId(null);
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  const sendReport = async () => {
    setIsSendingReport(true);
    setReportStatus(null);

    try {
      const response = await fetch("/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: buildReport(data),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || t("notepadReportError"));
      }

      setReportStatus({
        type: "success",
        message: t("notepadReportSuccess"),
      });
    } catch {
      setReportStatus({
        type: "error",
        message: t("notepadReportError"),
      });
    } finally {
      setIsSendingReport(false);
    }
  };

  const pendingTask = tasks.find((t) => t.id === confirmDeleteId);

  return (
    <>
      <div className="notepad-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            data-tab={tab}
            className={`notepad-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
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
          <button
            className="notepad-send-btn"
            onClick={sendReport}
            disabled={isSendingReport}
          >
            {isSendingReport ? t("notepadReportSending") : t("notepadReportSend")}
          </button>
          <button
            className="notepad-add-btn"
            onClick={addTask}
            title={t("notepadAdd")}
          >
            +
          </button>
        </div>
      </div>

      {reportStatus && (
        <div
          className={`notepad-report-status ${reportStatus.type}`}
          aria-live="polite"
        >
          {reportStatus.message}
        </div>
      )}

      <div className="notepad-list" data-tab={activeTab}>
        {tasks.length === 0 && (
          <div className="empty">{t("notepadEmpty")}</div>
        )}
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`notepad-item ${task.expanded ? "expanded" : ""}`}
          >
            <div
              className="notepad-item-header"
              onClick={() => updateTask(task.id, { expanded: !task.expanded })}
            >
              <span className="notepad-chevron">
                {task.expanded ? "▾" : "▸"}
              </span>
              <input
                className="notepad-name-input"
                value={task.name}
                placeholder={t("notepadDefaultName")}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateTask(task.id, { name: e.target.value })}
              />
              <button
                className="notepad-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(task.id);
                }}
              >
                ×
              </button>
            </div>
            {task.expanded && (
              <div className="notepad-item-body">
                <textarea
                  className="notepad-textarea"
                  placeholder={t("notepadPlaceholder")}
                  value={task.content}
                  onChange={(e) =>
                    updateTask(task.id, { content: e.target.value })
                  }
                />
                <div className="notepad-item-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => updateTask(task.id, { content: "" })}
                  >
                    {t("notepadClear")}
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => handleCopy(task.id, task.content)}
                  >
                    {copiedId === task.id ? "✓" : t("notepadCopy")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {confirmDeleteId && (
        <div
          className="confirm-overlay"
          onClick={() => setConfirmDeleteId(null)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-title">{t("notepadConfirmDelete")}</p>
            {pendingTask?.name && (
              <p className="confirm-name">«{pendingTask.name}»</p>
            )}
            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                {t("notepadConfirmNo")}
              </button>
              <button
                className="btn-danger"
                onClick={() => deleteTask(confirmDeleteId)}
              >
                {t("notepadConfirmYes")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
