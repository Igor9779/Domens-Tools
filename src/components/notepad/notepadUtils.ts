export type Task = {
  id: string;
  name: string;
  content: string;
  expanded: boolean;
};

export type TabsData = Record<string, Task[]>;
export type WeeklyReports = Record<string, Record<string, number>>;
export type SummaryResponse = { summary: Record<string, number>; total: number };

export const TABS = ["2595", "2333", "3100"] as const;
export const STORAGE_KEY = "notepad_data";
export const USERNAME_KEY = "username";
export const WEEKLY_REPORTS_KEY = "weekly_reports";

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function buildReport(
  data: TabsData,
  username: string,
  tabs: readonly string[]
): string {
  const formattedDate = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const total = tabs.reduce((sum, tab) => sum + (data[tab]?.length ?? 0), 0);

  return [
    `📊 Отчет за неделю (${username})`,
    `Дата: ${formattedDate}`,
    "",
    ...tabs.map((tab) => `${tab} — ${data[tab]?.length ?? 0} задач`),
    "",
    `🔥 Всего: ${total} задач`,
  ].join("\n");
}

export function buildSummaryReport(
  summary: Record<string, number>,
  tabs: readonly string[]
): string {
  const total = tabs.reduce((sum, tab) => sum + (summary[tab] ?? 0), 0);

  return [
    "Всего задач выполнено командой:",
    "",
    ...tabs.map((tab) => `${tab}: ${summary[tab] ?? 0} тасок;`),
    "",
    `Итого выполнено: ${total}`,
  ].join("\n");
}

export async function saveReportKV(
  username: string,
  counts: Record<string, number>
): Promise<void> {
  const response = await fetch("/save-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, counts }),
  });
  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(result?.error ?? "Failed to save report");
  }
}

export async function getSummaryKV(): Promise<SummaryResponse> {
  const response = await fetch("/get-summary");
  if (!response.ok) throw new Error("Failed to get summary");
  return response.json() as Promise<SummaryResponse>;
}

export function saveReportLocal(
  username: string,
  data: TabsData,
  tabs: readonly string[]
): void {
  const reports = getStoredReports();
  reports[username] = Object.fromEntries(
    tabs.map((tab) => [tab, data[tab]?.length ?? 0])
  );
  localStorage.setItem(WEEKLY_REPORTS_KEY, JSON.stringify(reports));
}

export function getSummary(tabs: readonly string[]): Record<string, number> {
  const reports = getStoredReports();
  const summary: Record<string, number> = Object.fromEntries(
    tabs.map((tab) => [tab, 0])
  );
  for (const userData of Object.values(reports)) {
    for (const tab of tabs) {
      summary[tab] = (summary[tab] ?? 0) + (userData[tab] ?? 0);
    }
  }
  return summary;
}

export function calculateTotals(
  data: TabsData,
  tabs: readonly string[]
): number {
  return tabs.reduce((sum, tab) => sum + (data[tab]?.length ?? 0), 0);
}

function getStoredReports(): WeeklyReports {
  try {
    const saved = localStorage.getItem(WEEKLY_REPORTS_KEY);
    if (saved) return JSON.parse(saved) as WeeklyReports;
  } catch {
    // ignore
  }
  return {};
}
