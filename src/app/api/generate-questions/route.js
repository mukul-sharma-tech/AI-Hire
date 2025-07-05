// pages/api/generate-questions.js or app/api/generate-questions/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { jobDescription } = await req.json();
    
    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const prompt = `
    You are an expert interviewer. Based on the following job description, generate exactly 5 interview questions with these guidelines:
    
    - The **first question** must always be a general introduction question like: "Tell me about yourself" or "Can you introduce yourself briefly?"
    - The next 4 should be relevant to the job description
    - Questions should be a **mix of technical and behavioral**
    - They should be **progressive in difficulty** (from easy to moderately difficult)
    - Each question must be **clear, concise, and professional**
    - **Do not number or bullet** the questions
    - **Return each question on a new line only**, no extra commentary
    
    Job Description:
    ${jobDescription}
    `.trim();
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Split by newlines and filter out empty lines
    const questions = text
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5); // Ensure we only get 5 questions

    // Fallback questions if generation fails
    if (questions.length === 0) {
      const fallbackQuestions = [
        'Hi, can you tell me a little about yourself?',
        'What interests you most about this role?',
        'What are your biggest strengths?',
        'Tell me about a time you faced a challenge.',
        'Where do you see yourself in the next few years?'
      ];
      return NextResponse.json({ questions: fallbackQuestions });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('[GENERATE QUESTIONS ERROR]', error);
    
    // Return fallback questions on error
    const fallbackQuestions = [
      'Hi, can you tell me a little about yourself?',
      'What interests you most about this role?',
      'What are your biggest strengths?',
      'Tell me about a time you faced a challenge.',
      'Where do you see yourself in the next few years?'
    ];
    
    return NextResponse.json({ questions: fallbackQuestions });
  }
}