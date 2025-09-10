import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
];

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      qaPairs,
      interviewType = "Technical",
      level = "Unspecified"
    } = body;

    if (!qaPairs || !Array.isArray(qaPairs)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const prompt = `
You are an experienced AI Interview Evaluator.

Below is a **${interviewType}** interview conducted at the **${level}** level. The transcript includes questions and the candidate's answers. Evaluate the performance thoroughly.

## Analyze Each Answer:
Briefly evaluate the quality of the candidate’s response for each question.

${qaPairs
      .map(
        (pair, index) =>
          `Q${index + 1}: ${pair.question}\nA${index + 1}: ${pair.answer}\nEvaluate A${index + 1} in 2–3 sentences.`
      )
      .join("\n\n")}

## Summary:
Give a short overview of how the candidate performed.

## Strengths:
List 2–3 strengths observed in the responses.

## Areas for Improvement:
List 2–3 areas where the candidate can improve.

## Suggestions:
Provide actionable advice or resources the candidate can use to improve.

## Final Score:
Give an overall score out of 10 with a short justification.
`.trim();

    let report = null;
    let lastError = null;

    for (const key of API_KEYS) {
      try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        if (text && text.length > 0) {
          report = text;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini Key Failed] ${key?.slice(-5)}...:`, err.message || err);
        continue;
      }
    }

    if (!report) {
      return Response.json({ error: "All API keys failed or no report generated" }, { status: 500 });
    }

    return Response.json({ report });

  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
