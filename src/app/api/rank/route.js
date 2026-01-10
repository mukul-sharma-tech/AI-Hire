import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  // process.env.GEMINI_API_KEY2,
  // process.env.GEMINI_API_KEY3,
  // process.env.GEMINI_API_KEY4,
];

// Gemini scoring prompt template
const getPrompt = (jd, resumeText, index) => `
You are a hiring assistant. Score this résumé from 0 to 100 based on how well it matches the job description.

Return response as:
Score: [numeric score]
Reason: [one line reason]

Job Description:
${jd}

Résumé #${index + 1}:
${resumeText}
`.trim();

export async function POST(req) {
  try {
    const { jd, resumes } = await req.json();

    if (!jd || !Array.isArray(resumes)) {
      return NextResponse.json({ error: 'Invalid input format' }, { status: 400 });
    }

    const rankCalls = resumes.map(async (res, index) => {
      for (const key of API_KEYS) {
        try {
          const genAI = new GoogleGenerativeAI(key);
          const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

          const result = await model.generateContent(getPrompt(jd, res.text, index));
          const text = result.response.text();

          const scoreMatch = text.match(/Score:\s*(\d+)/i);
          const reasonMatch = text.match(/Reason:\s*(.*)/i);

          return {
            id: res.id,
            name: res.name,
            email: res.email,
            score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
            rationale: reasonMatch ? reasonMatch[1].trim() : 'No rationale provided.',
          };
        } catch (err) {
          console.warn(`[Gemini Key Failed] ${key?.slice(-5)}... on résumé ${res.id}:`, err.message || err);
          continue; // Try next key
        }
      }

      // All keys failed
      return {
        id: res.id,
        name: res.name,
        email: res.email,
        score: 0,
        rationale: '❌ Error: All Gemini API keys failed for this résumé.',
      };
    });

    const rankings = await Promise.all(rankCalls);
    rankings.sort((a, b) => b.score - a.score);

    return NextResponse.json({ rankings });
  } catch (err) {
    console.error('[RANKING ERROR]', err);
    return NextResponse.json({ error: 'Failed to rank résumés.' }, { status: 500 });
  }
}
