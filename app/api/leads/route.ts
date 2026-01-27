import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = {
  source?: string;
  lang?: string;
  name?: string;
  lastName?: string;
  phone?: string;
  comment?: string;
  tourId?: string;
  tourTitle?: string;
  tourLink?: string;
};

function buildMessage(payload: LeadPayload) {
  const lines: string[] = [];
  const label = (value?: string) => (value ? value.trim() : "");

  lines.push("Новая заявка с сайта Qoratosh Travel");
  if (payload.source) {
    lines.push(`Источник: ${payload.source}`);
  }
  if (payload.lang) {
    lines.push(`Язык: ${payload.lang}`);
  }
  lines.push("");
  if (label(payload.name) || label(payload.lastName) || label(payload.phone)) {
    lines.push("Контакт:");
    if (label(payload.name) || label(payload.lastName)) {
      lines.push(
        `- Имя: ${[payload.name, payload.lastName]
          .filter(Boolean)
          .join(" ")}`
      );
    }
    if (label(payload.phone)) {
      lines.push(`- Телефон: ${payload.phone}`);
    }
  }
  if (label(payload.comment)) {
    lines.push(
      `Комментарий: ${payload.comment}`
    );
  }
  if (payload.tourTitle || payload.tourId || payload.tourLink) {
    lines.push("");
    lines.push("Тур:");
    if (payload.tourTitle) {
      lines.push(`- Название: ${payload.tourTitle}`);
    }
    if (payload.tourId) {
      lines.push(`- ID: ${payload.tourId}`);
    }
    if (payload.tourLink) {
      lines.push(`- Ссылка: ${payload.tourLink}`);
    }
  }

  return lines.filter(Boolean).join("\n");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Telegram bot is not configured" },
      { status: 500 }
    );
  }

  const payload = (await request.json()) as LeadPayload;
  const message = buildMessage(payload);

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      { error: "Telegram request failed", details: text },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
