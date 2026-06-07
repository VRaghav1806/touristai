# Tourist AI

An intelligent travel companion for exploring India, featuring a comprehensive AI-powered Smart Trip Planner, Packing Assistant, and interactive Chatbot. 

## Features
- **Smart Trip Planner:** Input your travel details to generate highly detailed, personalized day-by-day itineraries.
- **Packing Assistant:** Generate context-aware packing lists based on your destination's specific geography and weather.
- **AI Chatbot:** A 24/7 intelligent travel concierge to answer all your travel-related queries.
- **Beautiful UI:** Premium, modern glassmorphism design with immersive full-screen background animations.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB
- **AI Service:** Python, FastAPI, LangChain, Groq LLM, FAISS

## Getting Started

### 1. Frontend Configuration
The frontend runs on React via Vite.

```bash
cd frontend
npm install
npm run dev
```

### 2. Node Backend
The backend serves as the main API layer and connects to the MongoDB database.

```bash
cd backend
npm install
npm run dev
```

### 3. Python AI Service
The Python service powers the AI interactions via LangChain and Groq.
Make sure you have a `.env` file in the `ai-service` directory containing your `GROQ_API_KEY`.

```bash
cd ai-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
