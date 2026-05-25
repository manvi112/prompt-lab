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


app.post('/chat', async (req, res) => {
  try {

    const { userMessage, systemMessage, maxCompToken, temperature, model, presencePenalty, frequencyPenalty } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' })
    }

    chatHistory.push({ role: "user", content: userMessage })

    const window = chatHistory.slice(-10)

    const completion = await groq.chat.completions.create({

      model: model || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemMessage || "You are a helpful assistant."
        },
        ...window
      ],
      temperature: temperature ?? 0.3,
      n: 1,
      max_completion_tokens: maxCompToken || 200,
      presence_penalty: presencePenalty ?? 0,
      frequency_penalty: frequencyPenalty ?? 0,
    })

    const reply = completion.choices[0].message.content

    chatHistory.push({ role: "assistant", content: reply })

    res.json({ reply, usage: completion.usage })



  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/chat', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))