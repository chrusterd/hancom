// ============================================================
// Groq 프록시 서버
// 브라우저는 API 키를 가지면 안 되므로(누구나 볼 수 있어서 유출됨),
// 키를 아는 이 서버가 "대리인(프록시)"이 되어 Groq에 대신 물어봐준다.
// 흐름: 브라우저 → (질문) → 이 서버 → (질문+키) → Groq → 답 → 브라우저
// ============================================================

// path: 폴더 경로를 안전하게 이어붙여주는 Node 내장 도구
const path = require('path')

// .env 파일(비밀 금고)을 읽어서 process.env에 넣어준다
// __dirname은 "이 파일이 있는 폴더" → 어디서 실행해도 server/.env를 정확히 찾음
require('dotenv').config({ path: path.join(__dirname, '.env') })

// 금고에서 API 키 꺼내기 (.env 안의 GROQ_API_KEY=... 줄)
const key = process.env.GROQ_API_KEY

// express: 서버를 쉽게 만들게 해주는 도구
const express = require('express')
// cors: 다른 주소에서 열린 화면도 이 서버를 부를 수 있게 허용
const cors = require('cors')
// 서버 본체 만들기
const app = express()

app.use(cors())            // 모든 출처의 요청 허용
app.use(express.json())    // 요청에 담긴 JSON을 req.body로 풀어줌

// client 폴더의 파일(html/css/js)을 그대로 브라우저에 제공
// → 주소창에 http://localhost:3000 만 치면 client/index.html이 열린다
app.use(express.static(path.join(__dirname, '..', 'client')))

// "질문 창구": 브라우저의 app.js가 POST /api/chat 으로 대화를 보내면 여기서 받는다
app.post('/api/chat', async (req, res) => {
  // 브라우저가 보낸 JSON에서 대화 기록(messages)을 꺼내기
  // [{ role: 'user', content: '...' }, { role: 'assistant', content: '...' }, ...]
  // 예전 방식({ prompt: '질문' })으로 와도 동작하도록 변환해준다
  let { messages, prompt } = req.body
  if (!messages && prompt) messages = [{ role: 'user', content: prompt }]

  // 대화가 비어있으면 400(잘못된 요청)으로 바로 돌려보냄
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '대화 내용(messages)이 없습니다' })
  }

  try {
    // 서버가 Groq에 대신 요청 (키는 여기 헤더에만 존재 → 브라우저엔 안 보임)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',                                  // 데이터를 보내는 요청
      headers: {
        'Content-Type': 'application/json',            // "JSON으로 보낸다" 안내
        'Authorization': `Bearer ${key}`               // API 키로 자격 증명
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',                 // 사용할 AI 모델
        messages: messages                             // 대화 전체를 그대로 전달 → AI가 문맥을 안다
      })
    })

    // Groq의 응답을 객체로 변환
    const data = await groqRes.json()

    // 답변은 응답 안의 choices[0].message.content 에 들어있다
    // ?. 는 "그 항목이 없으면 에러 내지 말고 undefined로" 라는 안전장치
    const reply = data.choices?.[0]?.message?.content

    // 답을 못 찾으면 502(중간 서버가 이상한 응답을 받음) + 원본을 보여줌
    if (!reply) return res.status(502).json({ error: 'Groq 응답 이상: ' + JSON.stringify(data) })

    // 성공: 답변만 골라서 브라우저에게 돌려준다
    res.json({ reply })
  } catch (err) {
    // 인터넷 끊김 등으로 fetch 자체가 실패했을 때
    console.error('Groq 요청 오류:', err)
    res.status(500).json({ error: '서버에서 Groq 요청 중 오류가 발생했습니다' })
  }
})

// 3000번 포트를 열고 요청을 기다린다 (서버는 끄기 전까지 계속 실행됨)
app.listen(3000, () => console.log('서버 실행 중: http://localhost:3000'))
