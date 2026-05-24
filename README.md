# Prompt Lab

A sandbox UI to experiment with LLM API parameters using Groq.

## What it does
- Send custom system and user prompts to an LLM
- Control temperature and max completion tokens via UI
- See token usage (prompt, completion, total) after every response

## Tech Stack
- Frontend: HTML, Tailwind CSS, Vanilla JS
- Backend: Node.js, Express
- AI: Groq SDK (Llama 3.3 70b)

## Setup

1. Clone the repo
2. Install dependencies
   cd backend
   npm install
3. Create a .env file
   GROQ_API_KEY=your_key_here
4. Run the server
   node server.js
5. Open index.html in your browser

## What I learned building this
- How LLM API parameters work (temperature, max_completion_tokens, top_p, stop, stream)
- The 3 prompt roles — system, user, assistant
- How tokens are counted and why context window size matters
- How presence and frequency penalty shape responses