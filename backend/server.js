import express from 'express'
import cors from 'cors'
import Groq from "groq-sdk"
import 'dotenv/config'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

const groq = new Groq(
  {
    apiKey: process.env.GROQ_API_KEY
  });

let chatHistory = []
let summary = null


app.post('/chat', async (req, res) => {

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })
  res.flushHeaders()

  try {

    const { userMessage, systemMessage, maxCompToken, temperature, model, presencePenalty, frequencyPenalty } = req.body;

    if (!userMessage) {
      res.write(`data: ${JSON.stringify({ error: 'userMessage is required' })}\n\n`)
      res.end()
      return
    }

    chatHistory.push({ role: "user", content: userMessage })

    if (chatHistory.length > 10) {
      const oldMessages = chatHistory.slice(0, -6);
      const recentMessages = chatHistory.slice(-6);

      const summarizedText = [...(summary ? [`Previous summary: ${summary}`] : []),
      ...oldMessages.map(m => `${m.role}: ${m.content}`)
      ].join('\n')

      chatHistory = recentMessages

      const summaryCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a summarizer. Summarize the following conversation concisely. Always explicitly mention the user's name, key facts about them, and important topics discussed. Never confuse people mentioned in conversation with the user themselves."
          },
          {
            role: "user",
            content: summarizedText
          }
        ],
        temperature: 0,
        max_completion_tokens: 300
      })

      summary = summaryCompletion.choices[0].message.content
      console.log("Summary generated:", summary)
    }


    const completion = await groq.chat.completions.create({

      model: model || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemMessage || "You are a helpful assistant."
        },
        ...(summary ? [{ role: "system", content: "Conversation so far : " + summary }] : []),
        ...chatHistory
      ],
      temperature: temperature ?? 0.3,
      n: 1,
      max_completion_tokens: maxCompToken || 200,
      presence_penalty: presencePenalty ?? 0,
      frequency_penalty: frequencyPenalty ?? 0,
      stream: true,
    })

    let fullReply = ''
    let usage = null

    for await (const chunk of completion) {
      const token = chunk.choices[0]?.delta?.content || ''
      if (token) {
        fullReply += token
        res.write(`data: ${token}\n\n`)
      }

      if (chunk.usage) {
        usage = chunk.usage
      }
    }

    chatHistory.push({ role: "assistant", content: fullReply })

    res.write(`data: ${JSON.stringify({ done: true, usage })}\n\n`)
    res.end()


  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    res.end()
  }
})


app.listen(port, () => console.log('Server started on PORT : ' + port))