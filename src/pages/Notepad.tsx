import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";
import NotepadTabs from "../components/notepad/NotepadTabs";
import NotepadList from "../components/notepad/NotepadList";
import NotepadConfirmDelete from "../components/notepad/NotepadConfirmDelete";
import NotepadUsernameModal from "../components/notepad/NotepadUsernameModal";
import NotepadSummaryModal from "../components/notepad/NotepadSummaryModal";
import {
  TABS,
  STORAGE_KEY,
  USERNAME_KEY,
  type Task,
  type TabsData,
  buildReport,
  saveReportLocal,
  getSummary,
  calculateTotals,
  generateId,
} from "../components/notepad/notepadUtils";

const emptyData: TabsData = Object.fromEntries(TABS.map((tab) => [tab, []]));

type UsernameModalMode = "send" | "edit";

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
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem(USERNAME_KEY) ?? "";
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [reportStatus, setReportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [usernameModalMode, setUsernameModalMode] =
    useState<UsernameModalMode>("send");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!reportStatus) return;
    const id = window.setTimeout(() => setReportStatus(null), 3000);
    return () => window.clearTimeout(id);
  }, [reportStatus]);

  const tasks = data[activeTab] ?? [];
  const totalTasks = calculateTotals(data, TABS);

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

  const doSendReport = async (name: string) => {
    setIsSendingReport(true);
    setReportStatus(null);

    try {
      const response = await fetch("/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: buildReport(data, name, TABS, t, lang),
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(result?.error || t("notepadReportError"));
      }

      saveReportLocal(name, data, TABS);
      setReportStatus({ type: "success", message: t("notepadReportSuccess") });
    } catch {
      setReportStatus({ type: "error", message: t("notepadReportError") });
    } finally {
      setIsSendingReport(false);
    }
  };

  const handleSendReport = () => {
    if (!username) {
      setUsernameModalMode("send");
      setShowUsernameModal(true);
      return;
    }
    void doSendReport(username);
  };

  const handleSaveUsername = (name: string) => {
    setUsername(name);
    localStorage.setItem(USERNAME_KEY, name);
    setShowUsernameModal(false);
    if (usernameModalMode === "send") {
      void doSendReport(name);
    }
  };

  const handleEditUsername = () => {
    setUsernameModalMode("edit");
    setShowUsernameModal(true);
  };

  const handleShowSummary = () => {
    setSummaryData(getSummary(TABS));
    setShowSummaryModal(true);
  };

  const pendingTask = tasks.find((task) => task.id === confirmDeleteId);

  return (
    <>
      <NotepadTabs
        tabs={TABS}
        data={data}
        activeTab={activeTab}
        totalTasks={totalTasks}
        isSendingReport={isSendingReport}
        username={username}
        t={t}
        onTabChange={setActiveTab}
        onSendReport={handleSendReport}
        onAddTask={addTask}
        onShowSummary={handleShowSummary}
        onEditUsername={handleEditUsername}
      />

      {reportStatus && (
        <div
          className={`notepad-report-status ${reportStatus.type}`}
          aria-live="polite"
        >
          {reportStatus.message}
        </div>
      )}

      <NotepadList
        tasks={tasks}
        activeTab={activeTab}
        copiedId={copiedId}
        t={t}
        onUpdateTask={updateTask}
        onCopyTask={handleCopy}
        onDeleteRequest={setConfirmDeleteId}
      />

      {confirmDeleteId && (
        <NotepadConfirmDelete
          taskName={pendingTask?.name}
          t={t}
          onConfirm={() => deleteTask(confirmDeleteId)}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}

      {showUsernameModal && (
        <NotepadUsernameModal
          initialValue={username}
          t={t}
          onSave={handleSaveUsername}
          onCancel={() => setShowUsernameModal(false)}
        />
      )}

      {showSummaryModal && (
        <NotepadSummaryModal
          tabs={TABS}
          summary={summaryData}
          t={t}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </>
  );
}
