import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAzJBgngUnSBdJiQfIBrmCKs4bCTueyhao"); // 👈 paste key here

async function listModels() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAzJBgngUnSBdJiQfIBrmCKs4bCTueyhao");
    const data = await response.json();

    console.log("🔍 Full Response:\n", JSON.stringify(data, null, 2));
    if (data.models) {
      console.log("✅ Available Models:");
      data.models.forEach(m => console.log("-", m.name));
    } else {
      console.log("❌ No 'models' array found — your key might not be authorized for Gemini models.");
    }
  } catch (error) {
    console.error("⚠️ Error listing models:", error);
  }
}

listModels();
