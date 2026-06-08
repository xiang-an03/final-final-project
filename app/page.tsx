"use client";

import { ArrowLeft, ArrowRight, Instagram, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

type GenderPreference = "female" | "male";

type Option = {
  id: string;
  label: string;
  tags: string[];
  genderPreference?: GenderPreference;
};

type Question = {
  id: string;
  title: string;
  options: Option[];
};

type Candidate = {
  name: string;
  region: string;
  gender: GenderPreference;
  instagram: string;
  archetype: string;
  bio: string;
  traits: string[];
};

const baseQuestions: Question[] = [
  {
    id: "gender",
    title: "第一題：你想配對哪一種性別的藝人？",
    options: [
      { id: "female", label: "女藝人", tags: ["femalePreference"], genderPreference: "female" },
      { id: "male", label: "男藝人", tags: ["malePreference"], genderPreference: "male" }
    ]
  },
  {
    id: "faceType",
    title: "第二題：你喜歡狗相還是貓相？",
    options: [
      { id: "dog", label: "狗相：親近、陽光、笑起來很有感染力", tags: ["dogFace", "bright", "kind"] },
      { id: "cat", label: "貓相：高冷、精緻、眼神有距離感", tags: ["catFace", "cool", "mysterious"] }
    ]
  },
  {
    id: "personality",
    title: "第三題：你喜歡哪種個性？",
    options: [
      { id: "gentle", label: "溫柔照顧型", tags: ["gentle", "kind", "steady"] },
      { id: "confident", label: "自信主導型", tags: ["confident", "bold", "stylish"] },
      { id: "funny", label: "幽默會鬧型", tags: ["funny", "playful", "bright"] },
      { id: "focused", label: "專注有才華型", tags: ["focused", "creative", "deep"] }
    ]
  },
  {
    id: "socialEnergy",
    title: "第四題：你喜歡 I 人還是 E 人？",
    options: [
      { id: "introvert", label: "I 人：安靜、慢熟、只對熟人打開", tags: ["introvert", "calm", "deep"] },
      { id: "extrovert", label: "E 人：外向、直接、能帶動氣氛", tags: ["extrovert", "bright", "bold"] }
    ]
  },
  {
    id: "eyelid",
    title: "第五題：你喜歡單眼皮還是雙眼皮？",
    options: [
      { id: "monolid", label: "單眼皮：清冷、耐看、眼神有特色", tags: ["monolid", "cool", "cinematic"] },
      { id: "double", label: "雙眼皮：明亮、甜感、表情更外放", tags: ["doubleEyelid", "sweet", "bright"] }
    ]
  },
  {
    id: "date",
    title: "第七題：你喜歡的約會安排是？",
    options: [
      { id: "coffee", label: "咖啡廳深聊一下午", tags: ["calm", "deep", "steady"] },
      { id: "concert", label: "看演唱會或音樂節", tags: ["creative", "bright", "extrovert"] },
      { id: "workout", label: "一起運動或戶外活動", tags: ["athletic", "bright", "playful"] },
      { id: "gallery", label: "看展、看電影、拍城市照片", tags: ["cinematic", "creative", "cool"] }
    ]
  },
  {
    id: "communication",
    title: "第八題：你喜歡對方怎麼表達好感？",
    options: [
      { id: "direct", label: "直接告白，話說得很明確", tags: ["direct", "bold", "extrovert"] },
      { id: "actions", label: "用行動照顧你，不只會說", tags: ["acts", "kind", "steady"] },
      { id: "teasing", label: "用幽默打鬧讓你心動", tags: ["teasing", "funny", "playful"] },
      { id: "quietCare", label: "默默記住細節，在關鍵時刻出現", tags: ["quietCare", "introvert", "deep"] }
    ]
  },
  {
    id: "firstVibe",
    title: "第九題：你喜歡的第一眼整體氣質是？",
    options: [
      { id: "sunny", label: "陽光少年／少女感", tags: ["sunny", "dogFace", "bright"] },
      { id: "cold", label: "高冷神秘感", tags: ["cold", "catFace", "mysterious"] },
      { id: "luxury", label: "明艷大明星感", tags: ["luxury", "confident", "stylish"] },
      { id: "artistic", label: "文藝電影主角感", tags: ["artistic", "creative", "cinematic"] }
    ]
  },
  {
    id: "interest",
    title: "第十題：你喜歡對方有哪種興趣偏好？",
    options: [
      { id: "music", label: "音樂創作、唱歌、樂器", tags: ["music", "creative", "deep"] },
      { id: "dance", label: "跳舞、舞台表演、節奏感", tags: ["dance", "bold", "athletic"] },
      { id: "sports", label: "健身、球類、戶外運動", tags: ["sports", "athletic", "bright"] },
      { id: "fashion", label: "穿搭、精品、拍照風格", tags: ["fashion", "stylish", "catFace"] }
    ]
  }
];

const femaleBodyQuestion: Question = {
  id: "bodyType",
  title: "第六題：你喜歡的女生身材樣子是？",
  options: [
    { id: "femaleTall", label: "高挑模特感", tags: ["tall", "editorial", "stylish"] },
    { id: "femaleFit", label: "纖細但有運動線條", tags: ["fit", "athletic", "bright"] },
    { id: "femaleSoft", label: "柔和甜美、親近感強", tags: ["soft", "sweet", "kind"] },
    { id: "femaleStage", label: "比例搶眼、舞台存在感強", tags: ["stageBody", "bold", "dance"] }
  ]
};

const maleBodyQuestion: Question = {
  id: "bodyType",
  title: "第六題：你喜歡的男生身材樣子是？",
  options: [
    { id: "maleTall", label: "高挑修長型", tags: ["tall", "clean", "stylish"] },
    { id: "maleFit", label: "健身感明顯、肩膀寬", tags: ["fit", "athletic", "confident"] },
    { id: "maleLean", label: "精瘦俐落、少年感", tags: ["lean", "clean", "bright"] },
    { id: "maleWarm", label: "結實可靠、生活感強", tags: ["solid", "steady", "kind"] }
  ]
};

const candidates: Candidate[] = [
  {
    name: "IU",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/dlwlrma/",
    archetype: "溫柔才華型",
    bio: "歌手、演員與創作人，作品橫跨音樂和戲劇，氣質細膩、親近又有故事感。",
    traits: ["kind", "creative", "deep", "calm", "sweet", "music", "gentle", "introvert", "soft", "dogFace"]
  },
  {
    name: "Jisoo",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/sooyaaa__/",
    archetype: "清甜穩定型",
    bio: "BLACKPINK 成員與演員，形象清新優雅，帶有溫柔但不失自信的魅力。",
    traits: ["kind", "steady", "bright", "sweet", "doubleEyelid", "gentle", "dogFace", "clean", "femaleSoft"]
  },
  {
    name: "Lisa",
    region: "泰國／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/lalalalisa_m/",
    archetype: "自信舞台型",
    bio: "BLACKPINK 成員，舞台表現強烈，風格鮮明，適合喜歡自信和行動派魅力的人。",
    traits: ["bold", "stylish", "bright", "playful", "dance", "confident", "extrovert", "stageBody", "femaleFit"]
  },
  {
    name: "迪麗熱巴",
    region: "中國",
    gender: "female",
    instagram: "https://www.instagram.com/dilrabaxx63/",
    archetype: "明艷氣場型",
    bio: "演員，外型明亮有辨識度，常給人華麗、活潑又帶氣場的印象。",
    traits: ["bright", "stylish", "bold", "luxury", "confident", "doubleEyelid", "femaleTall", "fashion"]
  },
  {
    name: "小松菜奈",
    region: "日本",
    gender: "female",
    instagram: "https://www.instagram.com/konichan7/",
    archetype: "文藝冷調型",
    bio: "演員與模特兒，具有獨特電影感和時尚氣質，適合喜歡冷調文藝氛圍的人。",
    traits: ["cool", "creative", "deep", "cinematic", "catFace", "monolid", "introvert", "fashion", "femaleTall"]
  },
  {
    name: "Jungkook",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/bts.bighitofficial/",
    archetype: "活力全能型",
    bio: "BTS 成員，舞台、歌唱和表演能力都很突出，給人真誠、努力又有少年感的印象。",
    traits: ["bright", "playful", "bold", "clean", "dogFace", "extrovert", "dance", "music", "maleFit", "sports"]
  },
  {
    name: "Park Seo-joon",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/bn_sj2013/",
    archetype: "可靠暖男型",
    bio: "演員，代表形象成熟、自然、可靠，適合喜歡穩定感和生活感魅力的人。",
    traits: ["steady", "kind", "calm", "gentle", "acts", "dogFace", "maleWarm", "tall", "sports"]
  },
  {
    name: "Song Kang",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/songkang_b/",
    archetype: "浪漫氛圍型",
    bio: "演員，常見於浪漫劇作品，氣質柔和但帶距離感，適合喜歡氛圍感的人。",
    traits: ["mysterious", "cool", "deep", "soft", "cinematic", "catFace", "doubleEyelid", "introvert", "maleTall"]
  },
  {
    name: "王一博",
    region: "中國",
    gender: "male",
    instagram: "https://www.instagram.com/yibo.w_85/",
    archetype: "冷感才藝型",
    bio: "歌手、演員與舞者，風格偏冷、專注，適合喜歡才藝感和高冷氣質的人。",
    traits: ["cool", "stylish", "creative", "mysterious", "catFace", "focused", "introvert", "dance", "fashion", "maleLean"]
  },
  {
    name: "周杰倫",
    region: "台灣",
    gender: "male",
    instagram: "https://www.instagram.com/jaychou/",
    archetype: "音樂故事型",
    bio: "歌手、音樂人與導演，創作風格鮮明，適合喜歡才華、幽默和長期陪伴感的人。",
    traits: ["creative", "deep", "playful", "steady", "music", "focused", "funny", "introvert", "quietCare"]
  },
  {
    name: "佐藤健",
    region: "日本",
    gender: "male",
    instagram: "https://www.instagram.com/takerusatoh_staff/",
    archetype: "成熟神秘型",
    bio: "演員，形象沉穩、聰明，帶有成熟與神秘感，適合喜歡耐看型魅力的人。",
    traits: ["cool", "mysterious", "steady", "deep", "cinematic", "catFace", "monolid", "introvert", "maleLean"]
  },
  {
    name: "Bright Vachirawit",
    region: "泰國",
    gender: "male",
    instagram: "https://www.instagram.com/bbrightvc/",
    archetype: "陽光時髦型",
    bio: "演員與歌手，形象陽光、時髦，適合喜歡輕鬆自在又有外型存在感的人。",
    traits: ["bright", "stylish", "playful", "steady", "dogFace", "extrovert", "tall", "fashion", "maleTall"]
  }
];

const tagLabels: Record<string, string> = {
  acts: "行動派",
  artistic: "文藝",
  athletic: "運動感",
  bold: "自信",
  bright: "明亮",
  calm: "沉穩",
  catFace: "貓相",
  cinematic: "電影感",
  clean: "乾淨",
  cold: "高冷",
  confident: "主導感",
  creative: "才華",
  dance: "舞台感",
  deep: "深度",
  direct: "直接",
  dogFace: "狗相",
  doubleEyelid: "雙眼皮",
  editorial: "畫報感",
  extrovert: "E 人",
  fashion: "時尚",
  fit: "健身感",
  focused: "專注",
  funny: "幽默",
  gentle: "溫柔",
  introvert: "I 人",
  kind: "體貼",
  lean: "精瘦",
  luxury: "明艷",
  maleFit: "寬肩健身",
  maleLean: "精瘦少年感",
  maleTall: "高挑修長",
  maleWarm: "結實可靠",
  monolid: "單眼皮",
  music: "音樂",
  mysterious: "神秘",
  playful: "有趣",
  quietCare: "默默照顧",
  soft: "柔和",
  solid: "可靠身形",
  sports: "運動",
  stageBody: "舞台比例",
  steady: "穩定",
  stylish: "時髦",
  sunny: "陽光",
  sweet: "甜感",
  tall: "高挑",
  teasing: "打鬧感"
};

function getQuestions(genderPreference?: GenderPreference) {
  const bodyQuestion = genderPreference === "male" ? maleBodyQuestion : femaleBodyQuestion;
  return [...baseQuestions.slice(0, 5), bodyQuestion, ...baseQuestions.slice(5)];
}

function scoreCandidate(selected: Option[], candidate: Candidate) {
  const selectedTags = selected.flatMap((option) => option.tags);
  return candidate.traits.reduce((score, trait) => {
    return score + selectedTags.filter((tag) => tag === trait).length;
  }, 0);
}

function findBestMatch(selected: Option[]) {
  const genderPreference = selected.find((option) => option.genderPreference)?.genderPreference || "female";
  const pool = candidates.filter((candidate) => candidate.gender === genderPreference);

  return pool
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(selected, candidate)
    }))
    .sort((a, b) => b.score - a.score)[0];
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Option>>({});
  const [reason, setReason] = useState("");
  const [source, setSource] = useState<"openai" | "local" | "">("");
  const [loading, setLoading] = useState(false);
  const genderPreference = answers.gender?.genderPreference;
  const questions = useMemo(() => getQuestions(genderPreference), [genderPreference]);
  const current = questions[step];
  const isComplete = Object.keys(answers).length === questions.length;

  const selectedOptions = useMemo(() => Object.values(answers), [answers]);
  const match = useMemo(() => findBestMatch(selectedOptions), [selectedOptions]);
  const progress = Math.round(((step + 1) / questions.length) * 100);

  async function selectAnswer(option: Option) {
    const nextAnswers = { ...answers, [current.id]: option };

    if (current.id === "gender") {
      delete nextAnswers.bodyType;
    }

    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    const finalMatch = findBestMatch(Object.values(nextAnswers));

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.fromEntries(
            Object.entries(nextAnswers).map(([key, value]) => [key, value.label])
          ),
          candidate: finalMatch
        })
      });
      const data = await response.json();
      setReason(data.reason);
      setSource(data.source);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setReason("");
    setSource("");
    setLoading(false);
  }

  if (isComplete) {
    const matchedTraits = match.traits
      .map((trait) => tagLabels[trait])
      .filter(Boolean)
      .slice(0, 6)
      .join("・");

    return (
      <main className="shell result-shell">
        <section className="result-visual" aria-label="配對結果">
          <div className="result-copy">
            <span className="eyebrow">你的亞洲明星理想型</span>
            <h1>{match.name}</h1>
            <p>
              {match.region} · {match.archetype}
            </p>
          </div>
        </section>

        <section className="result-panel">
          <div className="match-score">
            <span>{Math.min(99, 74 + match.score * 3)}%</span>
            <p>心動匹配度</p>
          </div>
          <div>
            <h2>為什麼會配到 TA？</h2>
            <p className="reason">
              {loading ? "正在整理你的心動線索..." : reason || "你們的氣質很合拍，相處起來有舒服又有火花的可能。"}
            </p>
            <p className="bio">{match.bio}</p>
            <div className="traits">{matchedTraits}</div>
            <span className="source">
              {source === "openai" ? "ChatGPT 已個人化分析" : "本地規則配對"}
            </span>
          </div>
          <div className="result-actions">
            <a className="instagram-button" href={match.instagram} target="_blank" rel="noreferrer">
              <Instagram size={18} />
              Instagram
            </a>
            <button className="secondary-button" onClick={reset}>
              <RotateCcw size={18} />
              再測一次
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AI 理想型配對</span>
          <h1>你的亞洲明星理想型是誰？</h1>
          <p>回答十個明確偏好問題，讓 ChatGPT 依照性別、長相、個性、身材、約會和興趣，整理出最接近的亞洲明星類型。</p>
        </div>
      </section>

      <section className="quiz-panel" aria-label="理想型問卷">
        <div className="quiz-head">
          <div>
            <span className="step-label">
              {step + 1} / {questions.length}
            </span>
            <h2>{current.title}</h2>
          </div>
          <div className="progress" aria-label={`進度 ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="options">
          {current.options.map((option) => {
            const selected = answers[current.id]?.id === option.id;
            return (
              <button
                className={selected ? "option selected" : "option"}
                key={option.id}
                onClick={() => selectAnswer(option)}
              >
                <Sparkles size={18} />
                {option.label}
                <ArrowRight size={18} className="arrow" />
              </button>
            );
          })}
        </div>

        <div className="nav-row">
          <button className="icon-button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            <ArrowLeft size={20} />
          </button>
          <button className="text-button" onClick={reset}>
            重新開始
          </button>
        </div>
      </section>
    </main>
  );
}
