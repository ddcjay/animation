import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// 偵測常見動畫技術函式庫的特徵關鍵字
const TECH_SIGNATURES: Record<string, string[]> = {
  'GSAP': ['gsap', 'TweenMax', 'TweenLite', 'ScrollTrigger', 'TimelineMax'],
  'Framer Motion': ['framer-motion', 'useAnimation', 'AnimatePresence', 'motion.div'],
  'Three.js': ['three.js', 'three.min.js', 'THREE.', 'WebGLRenderer'],
  'Anime.js': ['animejs', 'anime.min.js', 'anime({'],
  'CSS': ['@keyframes', 'animation:', 'transition:'],
  'SVG': ['<svg', 'stroke-dasharray', 'stroke-dashoffset'],
  'React': ['react', 'ReactDOM', 'useState', 'useEffect'],
  'Vue.js': ['vue.js', 'createApp', 'v-bind', 'v-model'],
  'Lottie': ['lottie', 'lottie-web'],
  'ScrollReveal': ['scrollreveal'],
  'AOS': ['aos.js', 'data-aos'],
};

function detectTechs(html: string, scripts: string[]): string[] {
  const content = (html + scripts.join(' ')).toLowerCase();
  return Object.entries(TECH_SIGNATURES)
    .filter(([, keywords]) => keywords.some(kw => content.includes(kw.toLowerCase())))
    .map(([tech]) => tech);
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: '請提供有效的 URL' }, { status: 400 });
    }

    // 1. 抓取目標網頁的 HTML
    let html: string;
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnimTechBot/1.0)' },
        signal: AbortSignal.timeout(10000),
      });
      html = await response.text();
    } catch {
      return NextResponse.json({ success: false, error: '無法連接到該網站，請確認網址是否公開可訪問。' }, { status: 422 });
    }

    // 2. 用 Cheerio 解析 HTML，提取 <title>、<script src> 及 <style>/<script> 內容
    const $ = cheerio.load(html);
    const pageTitle = $('title').text().trim() || new URL(url).hostname;
    const scriptSrcs = $('script[src]').map((_, el) => $(el).attr('src') ?? '').get();
    const inlineScripts = $('script:not([src])').map((_, el) => $(el).html() ?? '').get();
    const inlineStyles = $('style').map((_, el) => $(el).html() ?? '').get();

    // 3. 初步偵測技術棧
    const detectedTechs = detectTechs(
      html + inlineStyles.join(''),
      [...scriptSrcs, ...inlineScripts]
    );

    // 4. 呼叫 Gemini AI 深度分析
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // 無 API Key 時，退回到基礎偵測結果
      return NextResponse.json({
        success: true,
        data: {
          title: pageTitle,
          category: detectedTechs[0] ?? 'CSS 動畫',
          description: `從 ${new URL(url).hostname} 擷取的動畫範例，使用了 ${detectedTechs.join(', ') || 'CSS'} 等技術。`,
          techStack: detectedTechs.length > 0 ? detectedTechs : ['CSS'],
          codeSnippet: `/* 請手動補充從 ${url} 擷取的核心程式碼 */`,
        },
      });
    }

    // 截取前 8000 字以避免 token 超量
    const sampleCode = inlineScripts.slice(0, 3).join('\n').slice(0, 8000);
    const sampleStyle = inlineStyles.slice(0, 2).join('\n').slice(0, 3000);

    const geminiPrompt = `你是一個專業的前端動畫技術分析師。
以下是從網頁 "${url}" 擷取的程式碼片段（頁面標題: "${pageTitle}"）。
請分析該頁面的動畫技術，並以 JSON 格式回覆，不要包含任何 markdown 或多餘說明文字。

要分析的內容：
<scripts>
${sampleCode}
</scripts>
<styles>
${sampleStyle}
</styles>

請回傳以下 JSON 格式：
{
  "title": "動畫範例的簡短中文標題（20字以內）",
  "category": "最主要使用的技術（如 GSAP、Framer Motion、CSS 動畫、Three.js 等）",
  "description": "中文說明，描述這個動畫的效果與特色（50-100字）",
  "techStack": ["技術1", "技術2"],
  "codeSnippet": "最具代表性的核心程式碼片段（純程式碼，無需解釋）"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // 清理 LLM 回傳，移除可能的 markdown code fence
    const jsonText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(jsonText);

    return NextResponse.json({ success: true, data: parsed });
  } catch (err: unknown) {
    console.error('[/api/analyze] error:', err);
    return NextResponse.json(
      { success: false, error: '伺服器分析時發生錯誤，請稍後再試。' },
      { status: 500 }
    );
  }
}
