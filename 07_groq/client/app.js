const chat = document.getElementById('chat')
const input = document.getElementById('q')
const btn = document.getElementById('btn')

// 대화 영역에 말풍선 하나 추가하고 그 요소를 돌려준다
function addMessage(role, text) {
  const div = document.createElement('div')
  div.className = `msg ${role}`
  div.textContent = text
  chat.appendChild(div)
  chat.scrollTop = chat.scrollHeight   // 항상 맨 아래로 스크롤
  return div
}

async function send() {
  const prompt = input.value.trim()
  if (!prompt) return

  input.value = ''
  btn.disabled = true

  addMessage('user', prompt)
  const aiMsg = addMessage('ai', '생각 중...')
  aiMsg.classList.add('loading')

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    const data = await res.json()
    aiMsg.classList.remove('loading')

    if (data.reply) {
      // 마크다운 → HTML로 변환해서 표시 (marked 라이브러리)
      aiMsg.innerHTML = marked.parse(data.reply)
    } else {
      aiMsg.classList.add('error')
      aiMsg.textContent = data.error || '알 수 없는 오류가 발생했습니다.'
    }
  } catch {
    aiMsg.classList.remove('loading')
    aiMsg.classList.add('error')
    aiMsg.textContent = '❌ 서버가 안 켜져 있어요. (07_groq 폴더에서 npm start)'
  }

  btn.disabled = false
  input.focus()
  chat.scrollTop = chat.scrollHeight
}

btn.addEventListener('click', send)
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') send()
})
