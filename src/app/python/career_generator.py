import os
import sys
import json
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser

# Load environment variables
load_dotenv()


def get_available_api_keys():
    """Fetch Gemini API keys in fallback order."""
    keys = [
        os.getenv("GEMINI_API_KEY"),
        os.getenv("GEMINI_API_KEY2"),
        os.getenv("GEMINI_API_KEY3"),
        os.getenv("GEMINI_API_KEY4"),
    ]
    return [k for k in keys if k]


def generate_career_path(stage, institution, field, background):
    """
    Generates a detailed career path using LangChain and Google's Gemini model,
    with API key fallback support.
    """
    api_keys = get_available_api_keys()
    if not api_keys:
        raise ValueError("No Gemini API keys found in environment variables.")

    template = """
    You are a world-class career strategist and life coach. Your expertise spans across all industries and life stages, from students to seasoned professionals looking for a change. Your task is to generate a comprehensive, actionable, and deeply personalized career plan based on the user's profile.

    **User's Profile:**
    - Current Stage: {stage}
    - Institution / Company: {institution}
    - Field of Study / Profession: {field}
    - Personal Background & Goals: {background}

    **Instructions:**
    1. Deeply analyze the user's profile and create 2-3 strategic career trajectories
    2. For each trajectory, provide a structured roadmap with distinct phases
    3. Each phase should include specific actionable items for upskilling, projects, and networking

    **CRITICAL: You must respond with ONLY a valid JSON object in this exact format:**

    {{
        "trajectories": [
            {{
                "title": "Career Path Title",
                "summary": "Brief description of this career trajectory",
                "phases": [
                    {{
                        "phaseTitle": "Phase Name (Timeline)",
                        "timeline": "3-6 months",
                        "details": {{
                            "upskilling": [
                                "Specific skill or course to learn",
                                "Another skill or certification"
                            ],
                            "projects": [
                                "Specific project or experience to build",
                                "Another project idea"
                            ],
                            "networking": [
                                "Specific networking activity",
                                "Another networking strategy"
                            ]
                        }}
                    }}
                ]
            }}
        ]
    }}

    Do not include any text before or after the JSON. Do not use markdown code blocks. Return only the raw JSON object.

    **BEGIN CAREER PLAN GENERATION**
    """
    prompt = PromptTemplate.from_template(template)

    last_error = None
    for key in api_keys:
        try:
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash-latest",
                google_api_key=key,
                temperature=0.6
            )
            chain = prompt | llm | StrOutputParser()

            career_path = chain.invoke({
                "stage": stage,
                "institution": institution,
                "field": field,
                "background": background
            })

            # Clean response
            career_path = career_path.strip()
            if career_path.startswith('```json'):
                career_path = career_path[7:]
            if career_path.startswith('```'):
                career_path = career_path[3:]
            if career_path.endswith('```'):
                career_path = career_path[:-3]
            career_path = career_path.strip()

            # Validate JSON
            parsed_json = json.loads(career_path)
            return json.dumps(parsed_json, indent=2)

        except Exception as e:
            last_error = e
            print(f"⚠️ API key failed, trying next... ({str(e)})", file=sys.stderr)
            continue

    # If all keys fail → fallback static response
    fallback_response = {
        "trajectories": [
            {
                "title": "Career Development Plan",
                "summary": f"Customized career path for {field} professional",
                "phases": [
                    {
                        "phaseTitle": "Immediate Focus (Next 3-6 months)",
                        "timeline": "3-6 months",
                        "details": {
                            "upskilling": [
                                "Identify key skills gaps in your current field",
                                "Complete relevant online courses or certifications"
                            ],
                            "projects": [
                                "Start a portfolio project showcasing your skills",
                                "Seek opportunities to lead projects at your current organization"
                            ],
                            "networking": [
                                "Join professional associations in your field",
                                "Attend industry meetups and conferences"
                            ]
                        }
                    }
                ]
            }
        ]
    }
    return json.dumps(fallback_response, indent=2)


if __name__ == "__main__":
    try:
        sys.stdin.reconfigure(encoding='utf-8', errors='replace')
        input_data = json.load(sys.stdin)

        stage_arg = input_data.get('stage')
        institution_arg = input_data.get('institution')
        field_arg = input_data.get('field')
        background_arg = input_data.get('background')

        if not all([stage_arg, institution_arg, field_arg, background_arg]):
            raise ValueError("Missing one or more required fields in JSON input.")

        result = generate_career_path(stage_arg, institution_arg, field_arg, background_arg)
        print(result)

    except json.JSONDecodeError:
        print("Error: Invalid JSON input received from Node.js.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred in the Python script: {e}", file=sys.stderr)
        sys.exit(1)
