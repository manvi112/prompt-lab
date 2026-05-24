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

app.post('/chat', async (req, res) => {
  try {
    const { userMessage, systemMessage, maxCompToken, temperature } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: 'userMessage is required' })
    }

    const completion = await groq.chat.completions.create({

      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: temperature ?? 0.3,
      n: 1,
      max_completion_tokens: maxCompToken || 200,
    })

    res.json({ reply: completion.choices[0].message.content, usage: completion.usage })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/chat', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))