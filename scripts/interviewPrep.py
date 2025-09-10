import os
import sys
import json
from dotenv import load_dotenv
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser

def generate_interview_roadmap(company, position, level, interview_type, interview_date):
    """
    Generates a prioritized, last-minute interview revision roadmap
    using Gemini, outputting in a structured JSON format.
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

        # Calculate days remaining
        try:
            interview_dt = datetime.strptime(interview_date, '%Y-%m-%d')
            today_dt = datetime.now().date()
            interview_date_only = interview_dt.date()
            days_remaining = (interview_date_only - today_dt).days
            if days_remaining < 0:
                days_remaining = 0
        except ValueError:
            days_remaining = 1  # Default to 1 day if date invalid

        template = """
        You are an expert technical recruiter and career coach from a top FAANG company. You specialize in creating hyper-focused, last-minute revision plans.

        Your task is to generate a prioritized revision roadmap based on the candidate's specific interview details. The output MUST be a valid JSON object.

        **JSON Schema:**
        {{
          "roadmapTitle": "Revision Plan: {position} at {company} ({days_remaining} Days)",
          "keyFocusAreas": [
            {{
              "areaTitle": "High-Priority Technical Concepts",
              "justification": "Why this area is critical for this role and company.",
              "topics": ["Specific topic 1", "Specific topic 2"]
            }},
            {{
              "areaTitle": "Behavioral Preparation (STAR Method)",
              "justification": "Why this is important for this company.",
              "topics": ["Prepare story for 'conflict'", "Prepare story for 'complex project'"]
            }},
            {{
              "areaTitle": "Company-Specific Research",
              "justification": "Shows genuine interest and helps you ask intelligent questions.",
              "topics": ["Review {company}'s latest earnings report", "Understand the core product for the '{position}' role"]
            }}
          ]
        }}

        **Candidate's Interview Details:**
        - Company: {company}
        - Position / Role: {position}
        - Level: {level}
        - Interview Type: {interview_type}
        - Days to Prepare: {days_remaining}

        Generate the JSON object. Prioritize ruthlessly based on the timeline.
        - **If 1-3 days:** Focus almost exclusively on the absolute most critical topics for the given interview type.
        - **If 4-7 days:** Broaden the scope slightly to include secondary topics.
        - **If 8+ days:** Provide a more comprehensive plan with fundamentals and advanced concepts.
        Tailor the justification and topics directly to all the inputs provided.
        """
        prompt = PromptTemplate.from_template(template)

        # Try each API key until success
        last_error = None
        for key in api_keys:
            try:
                llm = ChatGoogleGenerativeAI(
                    model="gemini-1.5-flash-latest",
                    google_api_key=key,
                    temperature=0.5,
                    generation_config={"response_mime_type": "application/json"}
                )

                chain = prompt | llm | StrOutputParser()
                roadmap_json_string = chain.invoke({
                    "company": company,
                    "position": position,
                    "level": level,
                    "interview_type": interview_type,
                    "days_remaining": days_remaining
                })
                return roadmap_json_string
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

        result = generate_interview_roadmap(
            company=input_data.get('company'),
            position=input_data.get('position'),
            level=input_data.get('level'),
            interview_type=input_data.get('interviewType'),
            interview_date=input_data.get('interviewDate')
        )

        print(result)

    except Exception as e:
        print(f"An error occurred in the Python script: {e}", file=sys.stderr)
        sys.exit(1)
