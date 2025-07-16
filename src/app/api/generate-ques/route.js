// import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { prompt } = body;

//     if (!prompt) {
//       return new Response(JSON.stringify({ error: 'Prompt is required' }), {
//         status: 400,
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return new Response(JSON.stringify({ text }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (err) {
//     console.error('[GenerateQuestions API Error]', err);
//     return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   }
// }





import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let lastError = null;

    for (const key of API_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return new Response(JSON.stringify({ text }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err) {
        lastError = err;
        console.warn(`[Key Failed] Switching to next key...`, err.message || err);
        continue; // try next key
      }
    }

    // If all keys fail
    return new Response(JSON.stringify({ error: 'All API keys failed or quota exceeded' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[GenerateQuestions API Error]', err);
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
