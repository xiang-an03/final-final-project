# 理想型明星配對網站

這是一個可部署到 Vercel 的 Next.js 網站。使用者回答十一個理想型問題後，網站會先用本地規則從亞洲明星候選名單中配對；如果有設定 OpenAI API key，後端會再請 ChatGPT 產生個人化配對理由。

## 本機啟動

```bash
npm install
npm run dev
```

打開 `http://localhost:3000`。

## Vercel 部署

1. 將此專案推到 GitHub。
2. 到 Vercel 建立新專案並選擇這個 repository。
3. Framework Preset 選 `Next.js`。
4. 在 Environment Variables 加上：

```bash
OPENAI_API_KEY=你的 OpenAI API key
```

可選：

```bash
OPENAI_MODEL=gpt-5-mini
```

如果沒有設定 `OPENAI_API_KEY`，網站仍可使用，只是結果理由會使用內建文案。

## 可調整內容

- 問題與答案：`app/page.tsx` 裡的 `questions`
- 明星候選名單、Instagram、簡介：`app/page.tsx` 裡的 `candidates`
- ChatGPT 回答風格：`app/api/match/route.ts` 裡的 system prompt
- 背景圖：`public/stage-match-bg.png`
