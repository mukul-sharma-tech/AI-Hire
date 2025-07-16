import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req) {
  const { jdText, resumeText } = await req.json();

  const prompt = `
You are an expert ATS (Applicant Tracking System) resume evaluator.

Given the following job description and resume, analyze and return the following in clear bullet points:

---

### Output Format:
1. **ATS Match Score** (0 to 100) — based on skills, experience, and keywords.
2. **Matched Keywords** — list keywords or phrases that were matched.
3. **Missing Keywords** — important items in JD not found in resume.
4. **Skill Match Summary** — analyze alignment between job requirements and candidate experience.
5. **Improvement Suggestions** — practical, actionable advice to make the resume more relevant.
6. **Short Justification of Score** — 2-3 lines summarizing the evaluation.

---

### Job Description:
${jdText}

---

### Resume:
${resumeText}

---

Use bullet points or clear sections in your response. Be concise, factual, and structured like a professional ATS tool.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    return NextResponse.json({ report: text });
  } catch (error) {
    console.error('Gemini error:', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
