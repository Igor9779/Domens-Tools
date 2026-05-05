import { kv } from "@vercel/kv";

const TABS = ["2595", "2333", "3100"] as const;

type ServerlessRequest = {
  method?: string;
};

type ServerlessResponse = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
};

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const summary: Record<string, number> = Object.fromEntries(
    TABS.map((tab) => [tab, 0])
  );

  try {
    const users = await kv.smembers<string[]>("users");

    if (users.length > 0) {
      const values = await Promise.all(
        users.map((user) => kv.get<Record<string, number>>(`report:${user}`))
      );

      for (const userData of values) {
        if (!userData) continue;
        for (const tab of TABS) {
          summary[tab] = (summary[tab] ?? 0) + (userData[tab] ?? 0);
        }
      }
    }
  } catch (error) {
    console.error("get-summary KV error:", error);
    return res.status(500).json({ error: "Failed to get summary" });
  }

  const total = TABS.reduce((sum, tab) => sum + summary[tab], 0);

  return res.status(200).json({ summary, total });
}
