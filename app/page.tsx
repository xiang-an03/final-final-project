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
    name: "Suzy",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/skuukzky/",
    archetype: "初戀清爽型",
    bio: "歌手與演員，形象清新自然，帶有乾淨、明亮又很有親近感的魅力。",
    traits: ["dogFace", "bright", "clean", "doubleEyelid", "gentle", "femaleSoft", "calm", "cinematic"]
  },
  {
    name: "Karina",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/katarinabluu/",
    archetype: "貓相冷艷型",
    bio: "aespa 成員，舞台感強，外型精緻冷艷，適合喜歡貓相和時髦氣場的人。",
    traits: ["catFace", "cool", "stylish", "confident", "dance", "stageBody", "fashion", "monolid"]
  },
  {
    name: "Tzuyu",
    region: "台灣／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/thinkaboutzu/",
    archetype: "高挑清甜型",
    bio: "TWICE 成員，形象高挑、乾淨、溫柔，帶有安靜但很有存在感的氣質。",
    traits: ["tall", "femaleTall", "sweet", "clean", "gentle", "introvert", "dogFace", "doubleEyelid"]
  },
  {
    name: "Sana",
    region: "日本／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/m.by__sana/",
    archetype: "甜感撒嬌型",
    bio: "TWICE 成員，形象明亮甜美，擅長用自然活力和親近感帶動氣氛。",
    traits: ["sweet", "dogFace", "bright", "extrovert", "funny", "teasing", "femaleSoft", "dance"]
  },
  {
    name: "Jennie",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/jennierubyjane/",
    archetype: "時髦貓相型",
    bio: "BLACKPINK 成員，風格時髦、眼神鮮明，適合喜歡貓相和精品感的人。",
    traits: ["catFace", "fashion", "stylish", "confident", "cool", "monolid", "femaleFit", "luxury"]
  },
  {
    name: "Rosé",
    region: "韓國／紐西蘭",
    gender: "female",
    instagram: "https://www.instagram.com/roses_are_rosie/",
    archetype: "音樂玫瑰型",
    bio: "BLACKPINK 成員，嗓音有辨識度，氣質溫柔又帶一點文藝感。",
    traits: ["music", "creative", "deep", "gentle", "dogFace", "femaleTall", "fashion", "introvert"]
  },
  {
    name: "Wonyoung",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/for_everyoung10/",
    archetype: "公主畫報型",
    bio: "IVE 成員，形象高挑精緻，適合喜歡甜美、明亮和畫報感的人。",
    traits: ["femaleTall", "tall", "sweet", "doubleEyelid", "luxury", "fashion", "bright", "editorial"]
  },
  {
    name: "An Yujin",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/_yujin_an/",
    archetype: "陽光隊長型",
    bio: "IVE 成員，形象明亮俐落，帶有健康、外向和可靠的氣質。",
    traits: ["dogFace", "bright", "extrovert", "athletic", "femaleFit", "steady", "direct", "sports"]
  },
  {
    name: "Taeyeon",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/taeyeon_ss/",
    archetype: "清冷主唱型",
    bio: "少女時代成員與歌手，聲線細膩，氣質清冷但情感表達很強。",
    traits: ["music", "creative", "cool", "deep", "introvert", "catFace", "femaleSoft", "monolid"]
  },
  {
    name: "Nayeon",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/nayeonyny/",
    archetype: "兔系甜笑型",
    bio: "TWICE 成員，形象甜美活潑，笑容很有感染力。",
    traits: ["dogFace", "sweet", "bright", "extrovert", "doubleEyelid", "funny", "femaleSoft", "dance"]
  },
  {
    name: "Momo",
    region: "日本／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/momo/",
    archetype: "舞蹈力量型",
    bio: "TWICE 成員，舞蹈能力突出，適合喜歡運動感和舞台存在感的人。",
    traits: ["dance", "athletic", "femaleFit", "stageBody", "bold", "dogFace", "sports", "extrovert"]
  },
  {
    name: "Winter",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/imwinter/",
    archetype: "冷甜反差型",
    bio: "aespa 成員，外型清冷精緻，但舞台和表情有甜感反差。",
    traits: ["catFace", "cool", "sweet", "monolid", "clean", "introvert", "dance", "femaleSoft"]
  },
  {
    name: "Ningning",
    region: "中國／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/imnotningning/",
    archetype: "明艷主唱型",
    bio: "aespa 成員，聲音有力量，形象明艷又有自信。",
    traits: ["music", "bold", "luxury", "doubleEyelid", "confident", "stageBody", "fashion", "extrovert"]
  },
  {
    name: "Yuqi",
    region: "中國／韓國",
    gender: "female",
    instagram: "https://www.instagram.com/yuqisong.923/",
    archetype: "低音直球型",
    bio: "(G)I-DLE 成員，聲線有特色，個性直率，帶有幽默和反差魅力。",
    traits: ["funny", "direct", "music", "dogFace", "bright", "confident", "teasing", "femaleFit"]
  },
  {
    name: "Miyeon",
    region: "韓國",
    gender: "female",
    instagram: "https://www.instagram.com/noodle.zip/",
    archetype: "甜美主唱型",
    bio: "(G)I-DLE 成員，氣質甜美乾淨，適合喜歡溫柔和明亮感的人。",
    traits: ["sweet", "doubleEyelid", "music", "gentle", "dogFace", "clean", "femaleSoft", "bright"]
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
  },
  {
    name: "V",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/thv/",
    archetype: "文藝神秘型",
    bio: "BTS 成員，氣質帶有藝術感和神秘感，適合喜歡電影氛圍與低調魅力的人。",
    traits: ["catFace", "cool", "mysterious", "cinematic", "music", "fashion", "introvert", "maleTall"]
  },
  {
    name: "Cha Eun-woo",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/eunwo.o_c/",
    archetype: "清爽校草型",
    bio: "ASTRO 成員與演員，形象乾淨、明亮、修長，適合喜歡清爽外型的人。",
    traits: ["dogFace", "clean", "bright", "doubleEyelid", "maleTall", "gentle", "music", "steady"]
  },
  {
    name: "Lee Min-ho",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/actorleeminho/",
    archetype: "成熟男主角型",
    bio: "演員，形象高挑成熟，帶有經典韓劇男主角的穩定感和存在感。",
    traits: ["tall", "maleTall", "steady", "confident", "luxury", "direct", "doubleEyelid", "cinematic"]
  },
  {
    name: "許光漢",
    region: "台灣",
    gender: "male",
    instagram: "https://www.instagram.com/kuanghanhsu/",
    archetype: "乾淨鄰家型",
    bio: "演員，氣質自然乾淨，帶有少年感和生活感，適合喜歡舒服相處節奏的人。",
    traits: ["dogFace", "clean", "bright", "maleLean", "gentle", "calm", "cinematic", "coffee"]
  },
  {
    name: "Win Metawin",
    region: "泰國",
    gender: "male",
    instagram: "https://www.instagram.com/winmetawin/",
    archetype: "陽光高挑型",
    bio: "演員與歌手，形象高挑清爽，帶有外向、輕鬆和時髦的魅力。",
    traits: ["dogFace", "bright", "extrovert", "maleTall", "fashion", "playful", "clean", "sports"]
  },
  {
    name: "RM",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/rkive/",
    archetype: "思想藝術型",
    bio: "BTS 成員，氣質成熟、有思想感，適合喜歡深度、音樂和藝術氛圍的人。",
    traits: ["music", "deep", "creative", "introvert", "focused", "artistic", "maleTall", "calm"]
  },
  {
    name: "Jimin",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/j.m/",
    archetype: "溫柔舞者型",
    bio: "BTS 成員，舞台表現細膩，氣質柔和但很有吸引力。",
    traits: ["dance", "gentle", "soft", "kind", "catFace", "maleLean", "music", "quietCare"]
  },
  {
    name: "J-Hope",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/uarmyhope/",
    archetype: "陽光舞台型",
    bio: "BTS 成員，舞蹈和舞台能量鮮明，適合喜歡外向、正向和節奏感的人。",
    traits: ["dance", "bright", "extrovert", "dogFace", "athletic", "funny", "direct", "sports"]
  },
  {
    name: "SUGA",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/agustd/",
    archetype: "冷感製作人型",
    bio: "BTS 成員與音樂製作人，氣質冷靜，適合喜歡才華、低調和深度的人。",
    traits: ["music", "focused", "introvert", "cool", "deep", "catFace", "monolid", "quietCare"]
  },
  {
    name: "Jin",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/jin/",
    archetype: "幽默暖男型",
    bio: "BTS 成員，形象親切明亮，帶有幽默和生活感。",
    traits: ["dogFace", "funny", "kind", "bright", "gentle", "maleWarm", "music", "teasing"]
  },
  {
    name: "Kai",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/zkdlin/",
    archetype: "性感舞者型",
    bio: "EXO 成員，舞台魅力強，適合喜歡舞蹈、時尚和強烈存在感的人。",
    traits: ["dance", "fashion", "bold", "confident", "catFace", "maleFit", "stageBody", "luxury"]
  },
  {
    name: "Baekhyun",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/baekhyunee_exo/",
    archetype: "甜感主唱型",
    bio: "EXO 成員，聲音有辨識度，形象明亮又很會帶氣氛。",
    traits: ["music", "bright", "dogFace", "extrovert", "funny", "doubleEyelid", "teasing", "clean"]
  },
  {
    name: "Taemin",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/xoalsox/",
    archetype: "藝術舞者型",
    bio: "SHINee 成員與 solo 歌手，舞台風格藝術感強，氣質神秘又細膩。",
    traits: ["dance", "artistic", "catFace", "cool", "mysterious", "maleLean", "creative", "introvert"]
  },
  {
    name: "Mingyu",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/min9yu_k/",
    archetype: "高挑陽光型",
    bio: "SEVENTEEN 成員，形象高挑、外向、生活感強，適合喜歡陽光大型犬感的人。",
    traits: ["dogFace", "maleTall", "bright", "extrovert", "sports", "fashion", "direct", "maleWarm"]
  },
  {
    name: "Wonwoo",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/everyone_woo/",
    archetype: "低調貓相型",
    bio: "SEVENTEEN 成員，氣質安靜冷調，適合喜歡貓相、慢熟和沉穩感的人。",
    traits: ["catFace", "introvert", "cool", "monolid", "deep", "quietCare", "maleLean", "calm"]
  },
  {
    name: "Hyunjin",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/hynjinnnn/",
    archetype: "畫報舞者型",
    bio: "Stray Kids 成員，舞台表現和視覺風格鮮明，適合喜歡時髦和藝術感的人。",
    traits: ["dance", "fashion", "catFace", "stylish", "artistic", "maleTall", "confident", "cool"]
  },
  {
    name: "Felix",
    region: "澳洲／韓國",
    gender: "male",
    instagram: "https://www.instagram.com/yong.lixx/",
    archetype: "低音甜心型",
    bio: "Stray Kids 成員，低音聲線有特色，形象甜但舞台反差很強。",
    traits: ["dogFace", "sweet", "music", "dance", "bright", "maleLean", "gentle", "teasing"]
  },
  {
    name: "Yeonjun",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/yawnzzn/",
    archetype: "時髦舞台型",
    bio: "TXT 成員，舞台感和穿搭風格強，適合喜歡潮流和外放魅力的人。",
    traits: ["fashion", "dance", "extrovert", "confident", "maleTall", "catFace", "stylish", "direct"]
  },
  {
    name: "G-DRAGON",
    region: "韓國",
    gender: "male",
    instagram: "https://www.instagram.com/xxxibgdrgn/",
    archetype: "潮流創作型",
    bio: "BIGBANG 成員與創作人，風格強烈，適合喜歡音樂、時尚和個人態度的人。",
    traits: ["music", "fashion", "creative", "confident", "catFace", "artistic", "focused", "luxury"]
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

function stableAnswerIndex(selected: Option[], size: number) {
  const key = selected.map((option) => option.id).join("|");
  const hash = Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0);
  return size === 0 ? 0 : hash % size;
}

function findBestMatch(selected: Option[]) {
  const genderPreference = selected.find((option) => option.genderPreference)?.genderPreference || "female";
  const pool = candidates.filter((candidate) => candidate.gender === genderPreference);
  const ranked = pool
    .map((candidate) => ({
      ...candidate,
      score: scoreCandidate(selected, candidate)
    }))
    .sort((a, b) => b.score - a.score);
  const topScore = ranked[0]?.score || 0;
  const closeMatches = ranked.filter((candidate) => candidate.score >= topScore - 1);

  return closeMatches[stableAnswerIndex(selected, closeMatches.length)] || ranked[0];
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
