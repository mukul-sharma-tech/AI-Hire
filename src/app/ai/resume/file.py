import os
from dotenv import load_dotenv

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain

# Load environment variables from .env file
load_dotenv()

def analyze_resume(job_description: str, resume: str):
    """
    Analyzes a resume against a job description using a RAG pipeline with Gemini.

    Args:
        job_description: The text of the job description.
        resume: The text of the candidate's resume.
    """
    print("🚀 Starting resume analysis...")

    # 1. Configure the LLM and Embedding Models
    # Make sure your GOOGLE_API_KEY is set in the .env file
    try:
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-latest", temperature=0.3)
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        print("✅ Models configured successfully.")
    except Exception as e:
        print(f"🔥 Error configuring Google AI models: {e}")
        print("🔥 Please ensure your GOOGLE_API_KEY is correctly set in the .env file.")
        return

    # 2. Create the RAG Prompt Template
    # This template instructs the LLM on how to use the retrieved context
    # (from the job description) to analyze the resume (the input).
    prompt_template = """
    You are an expert HR analyst and hiring manager with 20 years of experience.
    Your task is to analyze the provided resume against the job description context and provide a hiring recommendation.
    Based on the context (job description snippets) and the candidate's resume, provide a detailed analysis.

    Format your response as follows:

    **Match Score:** [Provide a percentage match score from 0% to 100% representing the candidate's suitability.]

    **Summary:** [A brief 2-3 sentence summary of the candidate's fit for the role, highlighting key qualifications and potential gaps.]

    **Decision:** [Make a clear hiring recommendation: "Recommended for Interview", "Possible Fit", or "Not a Good Fit". Provide a 1-2 sentence justification for your decision based on the analysis.]

    **Strengths:**
    * [A bulleted list of specific skills, experiences, or qualifications from the resume that strongly align with the job description.]
    * [Another strength...]
    * [And so on...]

    **Weaknesses:**
    * [A bulleted list of areas where the resume is lacking or does not meet the requirements specified in the job description.]
    * [Another weakness...]
    * [And so on...]

    **Context from Job Description:**
    {context}

    **Candidate's Resume:**
    {input}

    Please provide your analysis now:
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)
    print("✅ Prompt template created.")

    # 3. Index the Job Description into a Vector Store (RAG Indexing)
    # The JD is the "knowledge base" we want to search against.
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    jd_splits = text_splitter.split_text(job_description)

    print(f"📄 Job description split into {len(jd_splits)} chunks.")

    # Create a vector store from the JD chunks
    try:
        vector_store = FAISS.from_texts(jd_splits, embeddings)
        print("✅ Job description indexed into FAISS vector store.")
    except Exception as e:
        print(f"🔥 Error creating vector store: {e}")
        return

    # 4. Create the RAG Chain
    # This chain will:
    #   - Take the resume as input.
    #   - Retrieve relevant parts of the JD from the vector store.
    #   - "Stuff" the retrieved JD parts into the prompt's context.
    #   - Pass the combined prompt to the LLM.
    retriever = vector_store.as_retriever()
    document_chain = create_stuff_documents_chain(llm, prompt)
    retrieval_chain = create_retrieval_chain(retriever, document_chain)
    print("✅ RAG retrieval chain created.")

    # 5. Invoke the Chain and Get the Analysis
    print("\n🔍 Invoking analysis chain... please wait.\n")
    try:
        response = retrieval_chain.invoke({"input": resume})
    except Exception as e:
        print(f"🔥 An error occurred while invoking the chain: {e}")
        return

    # 6. Print the Result
    print("="*50)
    print("📋 Resume Analysis Report")
    print("="*50)
    if response and 'answer' in response:
        print(response['answer'])
    else:
        print("Sorry, the analysis could not be completed. The response was empty.")
    print("="*50)


if __name__ == '__main__':
    # --- SAMPLE DATA ---
    # You can replace these with your own job description and resume.
    
    sample_job_description = """
    Job Title: Senior Python Developer
    
    Company: TechInnovate Inc.
    Location: San Francisco, CA (Remote options available)
    
    Job Description:
    We are looking for an experienced Senior Python Developer to join our dynamic team. The ideal candidate will have extensive experience in building robust, scalable, and high-performance web applications. You will be responsible for server-side logic, defining and maintaining databases, and ensuring high performance and responsiveness to requests from the front-end.
    
    Responsibilities:
    - Design, build, and maintain efficient, reusable, and reliable Python code.
    - Integration of user-facing elements developed by front-end developers with server-side logic.
    - Implementation of security and data protection.
    - Integration of data storage solutions, including databases like PostgreSQL and NoSQL databases.
    - Develop and maintain RESTful APIs.
    - Performance tuning, improvement, balancing, usability, automation.
    - Work with containerization technologies like Docker and orchestration tools like Kubernetes.
    - Collaborate with a team of developers, designers, and product managers to deliver high-quality products.
    
    Required Qualifications:
    - 5+ years of professional experience in Python development.
    - Strong experience with web frameworks such as Django or Flask.
    - Proficient in building and consuming RESTful APIs.
    - Solid understanding of relational databases (e.g., PostgreSQL, MySQL).
    - Experience with cloud platforms (AWS, GCP, or Azure).
    - Familiarity with containerization (Docker, Kubernetes).
    - Strong problem-solving skills and ability to work in a team environment.
    
    Preferred Qualifications:
    - Experience with asynchronous programming (AsyncIO, Celery).
    - Knowledge of NoSQL databases (e.g., MongoDB, Redis).
    - Experience with CI/CD pipelines.
    - Bachelor's degree in Computer Science or related field.
    """

    sample_resume = """
    John Doe
    San Jose, CA | (555) 123-4567 | john.doe@email.com | linkedin.com/in/johndoe
    
    Summary:
    A results-oriented Python Developer with 6 years of experience in developing, testing, and deploying scalable web applications. Passionate about clean code and leveraging technology to solve complex problems. Seeking to contribute my skills in a challenging and growth-oriented environment.
    
    Experience:
    
    Software Engineer | WebSolutions LLC | Austin, TX | 2019 - Present
    - Developed and maintained server-side logic for client web applications using Python and the Flask framework, resulting in a 20% increase in performance.
    - Designed and implemented RESTful APIs to connect with front-end components and third-party services.
    - Managed and optimized PostgreSQL databases, including schema design and query tuning.
    - Deployed applications on AWS using Docker containers, managed via ECS.
    - Collaborated in an Agile team to define, design, and ship new features.
    
    Junior Developer | DataCorp | Houston, TX | 2017 - 2019
    - Assisted in the development of data processing scripts in Python.
    - Wrote unit tests to ensure code quality and reliability.
    - Gained foundational experience with Django and web development principles.
    
    Skills:
    - Languages: Python, JavaScript, SQL
    - Frameworks: Flask, Django
    - Databases: PostgreSQL, MySQL, basic knowledge of Redis
    - Cloud & DevOps: AWS (EC2, S3, ECS), Docker
    - Other: RESTful APIs, Git, Agile Methodologies
    
    Education:
    Bachelor of Science in Information Technology
    University of Texas, Austin, TX - 2017
    """

    analyze_resume(sample_job_description, sample_resume)

