// ============================================================
// Vercel 서버리스 함수 버전의 질문 창구
// - Vercel은 api/ 폴더의 파일을 자동으로 "/api/파일명" 주소로 만들어준다
//   → 이 파일은 https://내사이트.vercel.app/api/chat 이 된다
// - Express처럼 계속 떠 있는 서버가 아니라, 요청이 올 때만 실행되는 함수
// - API 키는 Vercel 대시보드의 환경변수(GROQ_API_KEY)에서 읽는다
// ============================================================

module.exports = async (req, res) => {
  // POST 이외의 요청은 거절
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 받습니다' })
  }

  const key = process.env.GROQ_API_KEY
  if (!key) {
    return res.status(500).json({ error: '서버에 GROQ_API_KEY 환경변수가 없습니다' })
  }

  // 대화 기록(messages) 꺼내기. 예전 방식(prompt)도 호환
  let { messages, prompt } = req.body || {}
  if (!messages && prompt) messages = [{ role: 'user', content: prompt }]

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: '대화 내용(messages)이 없습니다' })
  }

  try {
    // 서버가 Groq에 대신 요청 (로컬 서버와 동일한 로직)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: messages
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
}
