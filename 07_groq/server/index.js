// Groq 프록시 서버: 브라우저 대신 API 키를 가지고 Groq에 물어봐주는 창구
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })   // .env가 server 폴더 안에 있음
const key = process.env.GROQ_API_KEY

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// client 폴더를 정적 파일로 제공 → http://localhost:3000 접속하면 index.html이 열림
app.use(express.static(path.join(__dirname, '..', 'client')))

// 브라우저(app.js)가 보낸 질문을 받아 Groq에 대신 물어보고 답을 돌려준다
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: '질문(prompt)이 없습니다' })

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    })
    const data = await groqRes.json()
    const reply = data.choices?.[0]?.message?.content
    if (!reply) return res.status(502).json({ error: 'Groq 응답 이상: ' + JSON.stringify(data) })

    res.json({ reply })
  } catch (err) {
    console.error('Groq 요청 오류:', err)
    res.status(500).json({ error: '서버에서 Groq 요청 중 오류가 발생했습니다' })
  }
})

app.listen(3000, () => console.log('서버 실행 중: http://localhost:3000'))
