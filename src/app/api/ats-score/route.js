import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req) {
  const { jdText, resumeText } = await req.json();

  const prompt = `
You are an ATS (Applicant Tracking System) evaluator.

Compare the resume to the job description.

### TASKS:
1. Match skills, tools, technologies, and experience.
2. Identify missing keywords or skills.
3. Suggest how to improve the resume.
4. Give an ATS match score out of 100.
5. Explain the score in detail.

### JOB DESCRIPTION:
${jdText}

### RESUME:
${resumeText}
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
