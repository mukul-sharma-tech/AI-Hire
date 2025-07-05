// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextResponse } from 'next/server';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function POST(req) {
//   try {
//     const { jd, resumes } = await req.json();
//     const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

//     const rankCalls = resumes.map(async (res, i) => {
//       const prompt = `
// You are a hiring assistant. Score this résumé from 0 to 100 based on how well it matches the job description.

// Return response as:
// Score: [numeric score]
// Reason: [one line reason]

// Job Description:
// ${jd}

// Résumé #${i + 1}:
// ${res.text || res}
//       `.trim();

//       const result = await model.generateContent(prompt);
//       const text = result.response.text();

//       const scoreMatch = text.match(/Score:\s*(\d+)/i);
//       const reasonMatch = text.match(/Reason:\s*(.*)/i);

//       return {
//         score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
//         rationale: reasonMatch ? reasonMatch[1] : 'No rationale provided.',
//       };
//     });

//     const rankings = await Promise.all(rankCalls);

//     // Sort descending by score
//     rankings.sort((a, b) => b.score - a.score);

//     return NextResponse.json({ rankings });
//   } catch (err) {
//     console.error('[RANKING ERROR]', err);
//     return NextResponse.json({ error: 'Failed to rank resumes.' }, { status: 500 });
//   }
// }


// import { GoogleGenerativeAI } from '@google/generative-ai';
// import { NextResponse } from 'next/server';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function POST(req) {
//   try {
//     const { jd, resumes } = await req.json();
//     const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

//     const rankCalls = resumes.map(async (res, i) => {
//       try {
//         const prompt = `
// You are a hiring assistant. Score this résumé from 0 to 100 based on how well it matches the job description.

// Return response as:
// Score: [numeric score]
// Reason: [one line reason]

// Job Description:
// ${jd}

// Résumé #${i + 1}:
// ${res.text}
//         `.trim();

//         const result = await model.generateContent(prompt);
//         const text = result.response.text();

//         const scoreMatch = text.match(/Score:\s*(\d+)/i);
//         const reasonMatch = text.match(/Reason:\s*(.*)/i);

//         return {
//           name: res.name,
//           email: res.email,
//           score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
//           rationale: reasonMatch ? reasonMatch[1] : 'No rationale provided.',
//         };
//       } catch (error) {
//         return {
//           name: res.name,
//           email: res.email,
//           score: 0,
//           rationale: '❌ Error during Gemini API call.',
//         };
//       }
//     });

//     const rankings = await Promise.all(rankCalls);
//     rankings.sort((a, b) => b.score - a.score);

//     return NextResponse.json({ rankings });
//   } catch (err) {
//     console.error('[RANKING ERROR]', err);
//     return NextResponse.json({ error: 'Failed to rank resumes.' }, { status: 500 });
//   }
// }


import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { jd, resumes } = await req.json();
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const rankCalls = resumes.map(async (res, i) => {
      try {
        const prompt = `
You are a hiring assistant. Score this résumé from 0 to 100 based on how well it matches the job description.

Return response as:
Score: [numeric score]
Reason: [one line reason]

Job Description: ${jd}

Résumé #${i + 1}: ${res.text}
        `.trim();

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        const scoreMatch = text.match(/Score:\s*(\d+)/i);
        const reasonMatch = text.match(/Reason:\s*(.*)/i);

        return {
          id: res.id, // ✅ Include the id field
          name: res.name,
          email: res.email,
          score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
          rationale: reasonMatch ? reasonMatch[1] : 'No rationale provided.',
        };
      } catch (error) {
        return {
          id: res.id, // ✅ Include the id field even in error case
          name: res.name,
          email: res.email,
          score: 0,
          rationale: '❌ Error during Gemini API call.',
        };
      }
    });

    const rankings = await Promise.all(rankCalls);
    rankings.sort((a, b) => b.score - a.score);

    return NextResponse.json({ rankings });
  } catch (err) {
    console.error('[RANKING ERROR]', err);
    return NextResponse.json({ error: 'Failed to rank resumes.' }, { status: 500 });
  }
}