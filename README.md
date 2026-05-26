# Prompt Lab

A sandbox UI to experiment with LLM API parameters using Groq.

## What it does
- Send custom system and user prompts to an LLM
- Switch between multiple models (Llama 3.3 70b, Llama 3.1 8b, Gemma 2 9b)
- Control temperature, max completion tokens, presence penalty, frequency penalty via UI
- Chat UI with message bubbles — user messages on right, assistant on left
- Three versions of memory management:
  - Full history — sends entire conversation every request
  - Sliding window — only sends last 10 messages
  - Summarization — compresses old context using a smaller model, carries key facts forward
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
- How presence and frequency penalty shape response variety
- Difference between models — speed vs capability tradeoffs
- How to structure a full stack project with Express backend and vanilla JS frontend
- Sliding window tradeoff — lower tokens but loses early context
- Summarization — how to compress old messages using a secondary LLM call and carry key facts forward across long conversations

## How LLMs work — my understanding

LLMs are next-word prediction machines built on the transformer architecture. 
The core components:

- **Tokenization** — text is split into tokens before the model processes it
- **Embeddings** — tokens are converted into vectors (numbers representing meaning)
- **Attention mechanism** — the model understands each token in context of all 
  other tokens simultaneously, not word by word
- **Feed forward layers** — after attention captures relationships, feed forward 
  layers process that information deeper
- **Pretraining** — models are trained on petabytes of data to predict the next token
- **Fine tuning + RLHF** — pretrained models are then shaped for specific behavior 
  using human feedback and reward modeling

This project sits on top of all of that — using the final API to experiment with 
how these internals affect real outputs.