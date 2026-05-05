import { kv } from "@vercel/kv";

type RequestBody = {
  username?: unknown;
  counts?: unknown;
};

type ServerlessRequest = {
  method?: string;
  body?: RequestBody | string;
};

type ServerlessResponse = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
};

function parseBody(body: ServerlessRequest["body"]): RequestBody {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as RequestBody;
    } catch {
      return {};
    }
  }
  if (body && typeof body === "object") return body;
  return {};
}

export default async function handler(
  req: ServerlessRequest,
  res: ServerlessResponse
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, counts } = parseBody(req.body);

  if (typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "username is required" });
  }

  if (
    !counts ||
    typeof counts !== "object" ||
    Array.isArray(counts)
  ) {
    return res.status(400).json({ error: "counts must be an object" });
  }

  await kv.set(`report:${username.trim()}`, counts);
  return res.status(200).json({ ok: true });
}
