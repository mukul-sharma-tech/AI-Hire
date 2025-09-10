# import os
# import sys
# import json
# from dotenv import load_dotenv

# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
# from langchain_community.vectorstores import FAISS
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.prompts import ChatPromptTemplate
# from langchain.chains import create_retrieval_chain

# # It's good practice to load env variables at the start
# load_dotenv()

# def analyze_resume(job_description: str, resume: str):
#     """
#     Analyzes a resume against a job description using a RAG pipeline with Gemini.
#     This function is designed to be called from another process and prints the result to stdout.
#     """
#     try:
#         # Check for API key
#         if not os.getenv("GOOGLE_API_KEY"):
#             raise ValueError("GOOGLE_API_KEY not found in environment variables.")

#         llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.3)
#         embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

#         prompt_template = """
#         You are an expert HR analyst and hiring manager with 20 years of experience.
#         Your task is to analyze the provided resume against the job description context and provide a hiring recommendation.
#         Based on the context (job description snippets) and the candidate's resume, provide a detailed analysis.

#         Format your response as follows, using markdown for headings:

#         **Match Score:** [Provide a percentage match score from 0% to 100% representing the candidate's suitability.]

#         **Summary:** [A brief 2-3 sentence summary of the candidate's fit for the role, highlighting key qualifications and potential gaps.]

#         **Decision:** [Make a clear hiring recommendation: "Recommended for Interview", "Possible Fit", or "Not a Good Fit". Provide a 1-2 sentence justification for your decision based on the analysis.]

#         **Strengths:**
#         * [A bulleted list of specific skills, experiences, or qualifications from the resume that strongly align with the job description.]
#         * [Another strength...]

#         **Weaknesses:**
#         * [A bulleted list of areas where the resume is lacking or does not meet the requirements specified in the job description.]
#         * [Another weakness...]

#         **Context from Job Description:**
#         {context}

#         **Candidate's Resume:**
#         {input}

#         Please provide your analysis now:
#         """
#         prompt = ChatPromptTemplate.from_template(prompt_template)

#         text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
#         jd_splits = text_splitter.split_text(job_description)

#         if not jd_splits:
#              raise ValueError("Job description text is empty or could not be split.")

#         vector_store = FAISS.from_texts(jd_splits, embeddings)
#         retriever = vector_store.as_retriever()

#         document_chain = create_stuff_documents_chain(llm, prompt)
#         retrieval_chain = create_retrieval_chain(retriever, document_chain)

#         response = retrieval_chain.invoke({"input": resume})

#         if response and 'answer' in response:
#             # Print the final analysis to stdout for the Node.js process to capture
#             print(response['answer'])
#         else:
#             raise ValueError("Analysis could not be completed. The response from the model was empty.")

#     except Exception as e:
#         # Print any errors to stderr
#         print(f"An error occurred: {e}", file=sys.stderr)
#         sys.exit(1)


# if __name__ == '__main__':
#     # Read the JSON input from stdin
#     try:
#         input_data = json.load(sys.stdin)
#         jd = input_data.get('jobDescription')
#         res = input_data.get('resume')

#         if not jd or not res:
#             raise ValueError("Missing jobDescription or resume in input.")

#         analyze_resume(jd, res)

#     except json.JSONDecodeError:
#         print("Error: Invalid JSON input received.", file=sys.stderr)
#         sys.exit(1)
#     except Exception as e:
#         print(f"A critical error occurred in the main block: {e}", file=sys.stderr)
#         sys.exit(1)
import os
import sys
import json
from dotenv import load_dotenv

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain

# It's good practice to load env variables at the start
load_dotenv()

def sanitize_text(text: str) -> str:
    """
    Removes unsupported characters that can cause encoding errors,
    specifically surrogate pairs that are not allowed in UTF-8 when alone.
    """
    return text.encode('utf-8', 'replace').decode('utf-8')

def analyze_resume(job_description: str, resume: str):
    """
    Analyzes a resume against a job description using a RAG pipeline with Gemini.
    This function is designed to be called from another process and prints the result to stdout.
    """
    try:
        # Check for API key
        if not os.getenv("GOOGLE_API_KEY"):
            raise ValueError("GOOGLE_API_KEY not found in environment variables.")

        # **FIX**: Sanitize the input text to prevent encoding errors
        sanitized_jd = sanitize_text(job_description)
        sanitized_resume = sanitize_text(resume)

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest", temperature=0.3)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

        prompt_template = """
        You are an expert HR analyst and hiring manager with 20 years of experience.
        Your task is to analyze the provided resume against the job description context and provide a hiring recommendation.
        Based on the context (job description snippets) and the candidate's resume, provide a detailed analysis.

        Format your response as follows, using markdown for headings:

        **Match Score:** [Provide a percentage match score from 0% to 100% representing the candidate's suitability.]

        **Summary:** [A brief 2-3 sentence summary of the candidate's fit for the role, highlighting key qualifications and potential gaps.]

        **Decision:** [Make a clear hiring recommendation: "Recommended for Interview", "Possible Fit", or "Not a Good Fit". Provide a 1-2 sentence justification for your decision based on the analysis.]

        **Strengths:**
        * [A bulleted list of specific skills, experiences, or qualifications from the resume that strongly align with the job description.]
        * [Another strength...]

        **Weaknesses:**
        * [A bulleted list of areas where the resume is lacking or does not meet the requirements specified in the job description.]
        * [Another weakness...]

        **Context from Job Description:**
        {context}

        **Candidate's Resume:**
        {input}

        Please provide your analysis now:
        """
        prompt = ChatPromptTemplate.from_template(prompt_template)

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        jd_splits = text_splitter.split_text(sanitized_jd)

        if not jd_splits:
             raise ValueError("Job description text is empty or could not be split.")

        vector_store = FAISS.from_texts(jd_splits, embeddings)
        retriever = vector_store.as_retriever()

        document_chain = create_stuff_documents_chain(llm, prompt)
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        response = retrieval_chain.invoke({"input": sanitized_resume})

        if response and 'answer' in response:
            # Print the final analysis to stdout for the Node.js process to capture
            print(response['answer'])
        else:
            raise ValueError("Analysis could not be completed. The response from the model was empty.")

    except Exception as e:
        # Print any errors to stderr
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    # Read the JSON input from stdin
    try:
        # Configure stdin to read utf-8, replacing errors
        sys.stdin.reconfigure(encoding='utf-8', errors='replace')
        input_data = json.load(sys.stdin)
        jd = input_data.get('jobDescription')
        res = input_data.get('resume')

        if not jd or not res:
            raise ValueError("Missing jobDescription or resume in input.")

        analyze_resume(jd, res)

    except json.JSONDecodeError:
        print("Error: Invalid JSON input received.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"A critical error occurred in the main block: {e}", file=sys.stderr)
        sys.exit(1)


