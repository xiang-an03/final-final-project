import { NextResponse } from "next/server";

type MatchRequest = {
  answers: Record<string, string>;
  candidate: {
    name: string;
    region: string;
    gender?: string;
    instagram?: string;
    archetype: string;
    bio?: string;
    traits: string[];
  };
};

const fallbackReason =
  "你們的共同點是情緒節奏舒服、相處方式自然，像是可以一邊分享生活小事，一邊慢慢累積默契的組合。";

export async function POST(request: Request) {
  const body = (await request.json()) as MatchRequest;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reason: fallbackReason,
      source: "local"
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
          {
            role: "system",
            content:
              "你是繁體中文的娛樂心理測驗文案助手。請用輕鬆、尊重、非斷言的語氣，根據使用者的問卷答案、外型氣質偏好和候選亞洲明星資料，生成一段 100 字以內的理想型配對理由。可以描述氣質、風格、相處節奏，不要暗示真人真的會交往或認識使用者，避免冒犯性外貌評價。"
          },
          {
            role: "user",
            content: JSON.stringify({
              answers: body.answers,
              matchedCelebrity: body.candidate
            })
          }
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({ reason: fallbackReason, source: "local" });
    }

    const data = await response.json();
    const text =
      data.output_text ||
      data.output?.flatMap((item: { content?: { text?: string }[] }) => item.content || [])
        ?.map((content: { text?: string }) => content.text)
        ?.filter(Boolean)
        ?.join("");

    return NextResponse.json({
      reason: text || fallbackReason,
      source: text ? "openai" : "local"
    });
  } catch {
    return NextResponse.json({ reason: fallbackReason, source: "local" });
  }
}
