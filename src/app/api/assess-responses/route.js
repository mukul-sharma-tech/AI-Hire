// pages/api/assess-responses.js or app/api/assess-responses/route.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { jobDescription, conversation } = await req.json();
    
    if (!jobDescription || !conversation || conversation.length === 0) {
      return NextResponse.json({ error: 'Job description and conversation are required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    // Format conversation for analysis
    const conversationText = conversation
      .map((item, index) => `
Question ${index + 1}: ${item.question}
Answer: ${item.answer}
      `)
      .join('\n');

    const prompt = `
You are an expert HR interviewer evaluating a candidate's interview performance. 
Analyze the following interview conversation based on the job description and provide:

1. Overall Score (0-100)
2. Detailed Assessment (2-3 paragraphs)
3. Strengths (bullet points)
4. Areas for Improvement (bullet points)
5. Recommendation (Hire/Consider/Reject with brief reason)

Be professional, constructive, and specific in your feedback.

Job Description:
${jobDescription}

Interview Conversation:
${conversationText}

Please format your response as follows:
SCORE: [number]
ASSESSMENT: [detailed paragraphs]
STRENGTHS:
• [strength 1]
• [strength 2]
• [strength 3]
IMPROVEMENTS:
• [improvement 1]
• [improvement 2]
• [improvement 3]
RECOMMENDATION: [Hire/Consider/Reject] - [brief reason]
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse the response
    const scoreMatch = text.match(/SCORE:\s*(\d+)/i);
    const assessmentMatch = text.match(/ASSESSMENT:\s*(.*?)(?=STRENGTHS:|$)/is);
    const strengthsMatch = text.match(/STRENGTHS:\s*(.*?)(?=IMPROVEMENTS:|$)/is);
    const improvementsMatch = text.match(/IMPROVEMENTS:\s*(.*?)(?=RECOMMENDATION:|$)/is);
    const recommendationMatch = text.match(/RECOMMENDATION:\s*(.*?)$/is);

    const feedback = {
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      assessment: assessmentMatch ? assessmentMatch[1].trim() : 'Assessment could not be generated.',
      strengths: strengthsMatch 
        ? strengthsMatch[1].trim().split('\n').map(s => s.replace(/^[•\-\*]\s*/, '').trim()).filter(s => s)
        : [],
      improvements: improvementsMatch 
        ? improvementsMatch[1].trim().split('\n').map(s => s.replace(/^[•\-\*]\s*/, '').trim()).filter(s => s)
        : [],
      recommendation: recommendationMatch ? recommendationMatch[1].trim() : 'No recommendation available.',
      assessedAt: new Date().toISOString()
    };

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('[ASSESS RESPONSES ERROR]', error);
    
    // Return fallback feedback on error
    const fallbackFeedback = {
      score: 50,
      assessment: 'Unable to generate detailed assessment due to technical issues. Please review manually.',
      strengths: ['Participated in the interview', 'Provided responses to questions'],
      improvements: ['Manual review recommended'],
      recommendation: 'Consider - Manual review required',
      assessedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ feedback: fallbackFeedback });
  }
}