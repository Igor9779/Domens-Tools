import axios from "axios";

type RequestBody = {
  text?: unknown;
};

type ServerlessRequest = {
  method?: string;
  body?: RequestBody | string;
};

type ServerlessResponse = {
  setHeader: (name: string, value: string | string[]) => void;
  status: (code: number) => ServerlessResponse;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

function parseBody(body: ServerlessRequest["body"]): RequestBody {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as RequestBody;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body;
  }

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

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return res
      .status(500)
      .json({ error: "Telegram credentials are not configured" });
  }

  const { text } = parseBody(req.body);

  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: text.trim(),
      },
      {
        timeout: 10000,
      }
    );

    return res.status(200).json({ ok: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Telegram API error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected Telegram error:", error);
    }

    return res
      .status(500)
      .json({ error: "Failed to send report to Telegram" });
  }
}
