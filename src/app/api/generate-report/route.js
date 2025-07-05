import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { qaPairs, interviewType = "Technical" } = body;

    if (!qaPairs || !Array.isArray(qaPairs)) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an experienced AI Interview Evaluator.

Below is a ${interviewType} interview transcript with questions and the candidate's answers. Analyze the performance in detail.

## Analyze Each Answer:
Briefly evaluate the quality of the candidate’s response for each question.

${qaPairs
      .map(
        (pair, index) =>
          `Q${index + 1}: ${pair.question}\nA${index + 1}: ${pair.answer}\nEvaluate A${index + 1} in 2-3 sentences.`
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
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ report: text });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
