from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import Optional
from contextlib import asynccontextmanager

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    global vector_store
    index_path = "faiss_index"
    if os.path.exists(index_path):
        vector_store = FAISS.load_local(index_path, embeddings, allow_dangerous_deserialization=True)
    else:
        # Create a dummy index to start with
        vector_store = FAISS.from_texts(["Tourist AI is an intelligent travel assistant for India. The Taj Mahal is in Agra, Uttar Pradesh."], embeddings)
        vector_store.save_local(index_path)
    yield

app = FastAPI(title="Tourist AI - AI Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq LLM
groq_api_key = os.getenv("GROQ_API_KEY", "")
llm = ChatGroq(
    groq_api_key=groq_api_key,
    model_name="llama-3.1-8b-instant"
)

# Initialize Embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Global Vector Store Variable
vector_store: Optional[FAISS] = None

class ChatRequest(BaseModel):
    query: str

class IngestRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Tourist AI - RAG Service is running"}

@app.post("/api/ingest")
def ingest_data(req: IngestRequest):
    global vector_store
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(req.text)
    
    # Add new chunks to existing vector store
    new_vector_store = FAISS.from_texts(chunks, embeddings)
    if vector_store:
        vector_store.merge_from(new_vector_store)
    else:
        vector_store = new_vector_store
        
    vector_store.save_local("faiss_index")
    return {"message": f"Successfully ingested {len(chunks)} chunks of data."}

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    if not vector_store:
        raise HTTPException(status_code=500, detail="Vector store not initialized")

    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    
    system_prompt = (
        "You are Tourist AI, an expert travel guide for India. "
        "Use the following pieces of retrieved context to answer the question. "
        "If you don't know the answer, just say that you don't know. "
        "Do not hallucinate places that don't exist. "
        "Context: {context}"
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{input}"),
    ])
    
    # LCEL (LangChain Expression Language) Pipeline
    rag_chain = (
        {"context": retriever | format_docs, "input": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    try:
        response = rag_chain.invoke(req.query)
        return {"response": response}
    except Exception as e:
        import traceback
        return {"response": f"Error: {str(e)}\n{traceback.format_exc()}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
