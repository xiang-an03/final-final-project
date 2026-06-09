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
  candidates?: Array<{
    name: string;
    region: string;
    gender?: string;
    instagram?: string;
    archetype: string;
    bio?: string;
    traits: string[];
    score?: number;
  }>;
};

const fallbackReason =
  "你們的共同點是情緒節奏舒服、相處方式自然，像是可以一邊分享生活小事，一邊慢慢累積默契的組合。";

function parseModelJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as MatchRequest;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      reason: fallbackReason,
      selectedName: body.candidate.name,
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
              "你是繁體中文的娛樂心理測驗分析助手。請根據使用者問卷答案，從候選明星 shortlist 中選出最適合的一位，並給出 110 字以內的配對理由。理由可以分析氣質、職業類型、相處節奏、外型偏好與興趣，但不要暗示真人真的會交往或認識使用者，避免冒犯性外貌評價。只能回傳 JSON，格式為 {\"selectedName\":\"候選名單中的名字\",\"reason\":\"繁體中文理由\"}。"
          },
          {
            role: "user",
            content: JSON.stringify({
              answers: body.answers,
              localBestMatch: body.candidate,
              shortlist: body.candidates?.length ? body.candidates : [body.candidate]
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
    const parsed = text ? parseModelJson(text) : null;
    const selectedName =
      typeof parsed?.selectedName === "string" &&
      (body.candidates || [body.candidate]).some((candidate) => candidate.name === parsed.selectedName)
        ? parsed.selectedName
        : body.candidate.name;
    const reason = typeof parsed?.reason === "string" ? parsed.reason : text;

    return NextResponse.json({
      reason: reason || fallbackReason,
      selectedName,
      source: reason ? "openai" : "local"
    });
  } catch {
    return NextResponse.json({ reason: fallbackReason, selectedName: body.candidate.name, source: "local" });
  }
}
