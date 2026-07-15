// ============================================================
// 채팅 화면의 동작 담당 (index.html이 이 파일을 불러온다)
// 역할: 입력창의 질문을 서버(/api/chat)로 보내고,
//       돌아온 답변을 말풍선으로 화면에 그린다.
// ============================================================

// HTML에서 필요한 요소 3개를 찾아 변수에 담아둔다
const chat = document.getElementById('chat')    // 대화가 쌓이는 영역
const input = document.getElementById('q')      // 질문 입력칸
const btn = document.getElementById('btn')      // 보내기(↑) 버튼

// 대화 기억 장치: 지금까지 주고받은 모든 메시지를 순서대로 저장
// [{ role: 'user', content: '질문' }, { role: 'assistant', content: '답변' }, ...]
// 매번 이 배열 전체를 서버로 보내기 때문에 AI가 앞의 대화를 "기억"할 수 있다
const history = []

// 대화 영역에 말풍선 하나를 추가하고, 그 요소를 돌려준다
// role에는 'user'(내 질문) 또는 'ai'(답변)가 들어옴 → CSS가 모양을 다르게 입힘
function addMessage(role, text) {
  const div = document.createElement('div')   // 빈 <div> 만들기
  div.className = `msg ${role}`               // class="msg user" 또는 "msg ai"
  div.textContent = text                      // 글자 넣기
  chat.appendChild(div)                       // 대화 영역 맨 뒤에 붙이기
  chat.scrollTop = chat.scrollHeight          // 항상 맨 아래(최신 메시지)로 스크롤
  return div                                  // 나중에 내용을 바꿀 수 있게 돌려줌
}

// 질문을 서버로 보내고 답변을 받아오는 핵심 함수
// async: 이 안에서 await(기다리기)를 쓰겠다는 표시
async function send() {
  // 입력값의 앞뒤 공백 제거. 빈 문자열이면 아무것도 안 함
  const prompt = input.value.trim()
  if (!prompt) return

  input.value = ''      // 입력칸 비우기
  btn.disabled = true   // 답을 기다리는 동안 버튼 잠금 (연타 방지)

  // 내 질문을 화면에 표시하고, 대화 기록에도 추가
  addMessage('user', prompt)
  history.push({ role: 'user', content: prompt })

  // AI 자리에는 임시로 "생각 중..."을 표시해두고, 답이 오면 갈아끼운다
  const aiMsg = addMessage('ai', '생각 중...')
  aiMsg.classList.add('loading')   // 회색 기울임 스타일 적용

  try {
    // 서버의 질문 창구(/api/chat)로 POST 요청
    // 질문 하나가 아니라 "지금까지의 대화 전체(history)"를 보낸다
    // 주소를 '/api/chat' 상대 경로로 쓰면 로컬에선 localhost:3000으로,
    // 배포 후엔 vercel.app 주소로 자동으로 맞춰진다
    const res = await fetch('/api/chat', {
      method: 'POST',                                    // 데이터를 보내는 요청
      headers: { 'Content-Type': 'application/json' },   // "JSON으로 보낸다" 안내
      body: JSON.stringify({ messages: history })        // 대화 전체를 문자열로 변환
    })
    // 서버 응답(JSON 문자열)을 객체로 변환
    const data = await res.json()
    aiMsg.classList.remove('loading')   // "생각 중" 스타일 해제

    if (data.reply) {
      // 성공: 답변(마크다운 문자열)을 HTML로 변환해서 표시
      // marked는 index.html에서 불러온 마크다운 변환 라이브러리
      aiMsg.innerHTML = marked.parse(data.reply)
      // AI의 답변도 대화 기록에 추가 → 다음 질문 때 함께 전송됨
      history.push({ role: 'assistant', content: data.reply })
    } else {
      // 서버가 답 대신 에러를 보낸 경우 (예: 질문 누락, Groq 오류)
      aiMsg.classList.add('error')
      aiMsg.textContent = data.error || '알 수 없는 오류가 발생했습니다.'
    }
  } catch {
    // fetch 자체가 실패한 경우 = 서버에 연결조차 안 됨 (서버 꺼짐 등)
    aiMsg.classList.remove('loading')
    aiMsg.classList.add('error')
    aiMsg.textContent = '❌ 서버가 안 켜져 있어요. (07_groq 폴더에서 npm start)'
  }

  btn.disabled = false            // 버튼 잠금 해제
  input.focus()                   // 커서를 입력칸으로 되돌림 (바로 다음 질문 가능)
  chat.scrollTop = chat.scrollHeight   // 맨 아래로 스크롤
}

// 보내기 버튼을 클릭하면 send 실행
btn.addEventListener('click', send)
// 입력칸에서 Enter 키를 눌러도 send 실행
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') send()
})
