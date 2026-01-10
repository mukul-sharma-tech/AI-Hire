import os
import sys
import json
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser

def generate_hackathon_plan(theme, problem_statement):
    """
    Generates a detailed hackathon strategy plan using Gemini,
    outputting in a structured JSON format.
    """
    try:
        load_dotenv()

        # Load up to 4 keys from .env
        api_keys = [
            os.getenv("GEMINI_API_KEY1"),
            os.getenv("GEMINI_API_KEY2"),
            os.getenv("GEMINI_API_KEY3"),
            os.getenv("GEMINI_API_KEY4"),
        ]
        api_keys = [k for k in api_keys if k]  # remove None

        if not api_keys:
            raise ValueError("No Google API keys found in environment variables.")

        template = """
        You are an experienced hackathon mentor and judge who has guided winning teams for years. I am participating in a hackathon and need your expert guidance.
        Provide a detailed, prize-winning plan based on the details below. The output MUST be a valid JSON object.

        **JSON Schema to Follow:**
        {{
          "projectConcepts": [
            {{
              "conceptTitle": "Project Idea 1 Name",
              "uvp": "What makes this idea stand out and why judges will love it.",
              "mspBlueprint": {{
                "features": ["Key feature 1 for demo", "Key feature 2 for demo"],
                "techStack": ["Recommended frontend", "Recommended backend", "Key API/library"]
              }},
              "businessModel": {{
                "revenueStreams": ["Realistic way 1 to monetize", "Realistic way 2 to monetize"]
              }},
              "marketPotential": {{
                "targetUsers": "Specific user group",
                "marketSize": "Estimated size and growth of the market"
              }},
              "competitorAnalysis": {{
                  "competitors": [
                      {{ "name": "Competitor A", "advantage": "Why our approach is better." }}
                  ]
              }},
              "scalability": {{
                "vision": "How this project can evolve into a viable startup."
              }}
            }}
            // ... (Include a total of 3 project concepts)
          ]
        }}

        **Hackathon Details:**
        - Theme: {theme}
        - Problem Statement: {problem_statement}

        Generate the JSON object now. Provide 3 innovative, high-impact, and feasible project concepts.
        For each concept, fill out all the fields in the schema with practical, mentor-style advice. Be specific and give actionable insights.
        Think about what is realistically achievable in a 48-hour hackathon. The ideas should be impressive but buildable.
        """
        prompt = PromptTemplate.from_template(template)

        # Try each API key until success
        last_error = None
        for key in api_keys:
            try:
                llm = ChatGoogleGenerativeAI(
                    model="gemini-2.0-flash",
                    google_api_key=key,
                    temperature=0.7,  # Higher temperature for more creative ideas
                    generation_config={"response_mime_type": "application/json"}
                )

                chain = prompt | llm | StrOutputParser()
                plan_json_string = chain.invoke({
                    "theme": theme,
                    "problem_statement": problem_statement
                })
                return plan_json_string
            except Exception as e:
                last_error = e
                continue  # try next key

        # If all keys failed
        raise RuntimeError(f"All API keys failed. Last error: {last_error}")

    except Exception as e:
        raise e

if __name__ == "__main__":
    try:
        sys.stdin.reconfigure(encoding='utf-8', errors='replace')
        input_data = json.load(sys.stdin)
        
        result = generate_hackathon_plan(
            theme=input_data.get('theme'),
            problem_statement=input_data.get('problemStatement')
        )
        
        print(result)

    except Exception as e:
        print(f"An error occurred in the Python script: {e}", file=sys.stderr)
        sys.exit(1)
