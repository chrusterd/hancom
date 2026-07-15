# 로컬 Groq 서버 → Vercel 변환 프롬프트

로컬에서 `node index.js`로 돌리던 Groq 프록시 챗봇을 **Vercel 배포용**으로 바꾸는 프롬프트입니다.

## 사용법

1. 클로드(Claude Code)를 **본인 프로젝트 폴더**에서 엽니다 (`server/`, `client/`가 있는 폴더).
2. 아래 `--- 여기부터 복사 ---` ~ `--- 여기까지 복사 ---` 사이를 **통째로 복사**해서 붙여넣습니다.
3. 클로드가 파일을 바꿔줍니다.
4. 마지막의 **배포 절차**를 따라 하면 끝.

---

--- 여기부터 복사 ---

내 로컬 Groq 프록시 챗봇을 Vercel 배포용 구조로 바꿔줘. 아래대로 정확히 실행해.

## 목표 폴더 구조 (이렇게 바꿔줘)

```
프로젝트루트/
├── api/
│   └── chat.js       # 서버리스 함수 = /api/chat 창구
├── index.html        # 화면 뼈대 (루트로 이동)
├── app.js            # 화면 동작 (루트로 이동)
├── package.json
├── .env              # 로컬 키 (커밋 금지)
└── .gitignore
```

## 해야 할 변경 6가지

1. **서버 변환**: 기존 `server/index.js`(Express)를 지우고 `api/chat.js`를 새로 만들어. `express`·`cors`·`app.listen`을 전부 없애고 서버리스 함수 하나로 바꿔. Vercel이 `api/chat.js`를 자동으로 `/api/chat` 주소에 연결하니 포트 열 필요 없음.

2. **파일 이동**: `client/index.html` → 루트 `index.html`, `client/app.js` → 루트 `app.js`. 다 옮긴 뒤 빈 `server/`, `client/` 폴더는 삭제.

3. **fetch 주소 변경**: `app.js`에서 `fetch('http://localhost:3000/api/chat', ...)`를 상대경로 `fetch('/api/chat', ...)`로 바꿔. (화면·서버가 같은 도메인이라 배포돼도 그대로 작동)

4. **CORS 제거**: 화면과 서버가 같은 도메인이 되므로 `cors`는 필요 없음. 코드에서 제거.

5. **의존성 정리**: `express`·`cors`·`dotenv` 안 씀 (Node 내장 `fetch` 사용). `package.json`을 최소로 새로 만들어.

6. **비밀파일 제외**: `.gitignore`에 `.env`, `.env.*`, `node_modules/`, `.vercel` 추가. `.env`는 그대로 두되 절대 커밋되지 않게.

## 각 파일 내용 (이 내용 그대로 써줘)

### api/chat.js
```js
// Vercel 서버리스 함수 — 파일 하나가 곧 /api/chat 창구
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST만 됨' })
  }
  const key = process.env.GROQ_API_KEY
  if (!key) return res.json({ reply: '(mock) ' + req.body.prompt })

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: req.body.prompt }]
    })
  })
  const data = await groqRes.json()
  res.json({ reply: data.choices?.[0]?.message?.content || '(응답 없음)' })
}
```

### index.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Groq 챗봇</title>
</head>
<body>
  <input id="q" placeholder="물어보기" />
  <button id="btn">보내기</button>
  <p>AI 응답: <b id="ans">…</b></p>
  <script src="app.js"></script>
</body>
</html>
```

### app.js
```js
document.getElementById('btn').addEventListener('click', () => {
  const prompt = document.getElementById('q').value
  // 상대경로 — localhost 하드코딩 없음
  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  })
    .then(res => res.json())
    .then(data => { document.getElementById('ans').textContent = data.reply || data.error })
    .catch(() => { document.getElementById('ans').textContent = '❌ 서버 응답 없음 (배포/vercel dev 확인)' })
})
```

### package.json
```json
{
  "name": "groq-chatbot",
  "version": "1.0.0",
  "private": true
}
```

### .gitignore
```
.env
.env.*
node_modules/
.vercel
```

## 마지막
- `.env`의 `GROQ_API_KEY` 값은 건드리지 말고 그대로 둬.
- 다 바꾼 뒤 바뀐 폴더 구조를 트리로 보여줘.

--- 여기까지 복사 ---

---

## 클로드가 변환한 뒤 — 배포 절차 (본인이 터미널에서)

```bash
# 1. Vercel CLI 설치 (최초 1회)
npm i -g vercel

# 2. 로컬 테스트 — 브라우저에서 localhost:3000
vercel dev

# 3. 배포
vercel --prod
```

### ⚠️ 키 등록 (필수 — 안 하면 (mock) 답만 나옴)

`.env`는 커밋/배포가 안 되므로, 배포 서버에 키를 따로 넣어야 합니다.

```bash
# 3개 환경 각각 등록 (값 붙여넣기 → 나오는 선택지 Enter)
vercel env add GROQ_API_KEY production
vercel env add GROQ_API_KEY preview
vercel env add GROQ_API_KEY development

# 등록 후 반드시 재배포해야 적용됨
vercel --prod
```

또는 Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**.

## 자주 겪는 문제

| 증상 | 원인 | 해결 |
|---|---|---|
| `(mock) ...` 답 | 환경변수 `GROQ_API_KEY` 없음 | 위 키 등록 → **재배포** |
| `❌ 서버 응답 없음` | `index.html`을 file://로 직접 열었거나 서버 안 켜짐 | `vercel dev`로 실행 후 접속 |
| 환경변수 넣었는데 그대로 mock | 기존 배포는 변수 못 읽음 | `vercel --prod` **재배포** |

## 핵심 3줄

- 상시 서버(`node index.js`) → 요청 올 때만 켜지는 함수(`api/chat.js`)
- 화면 fetch는 상대경로 `/api/chat` — 배포돼도 그대로
- 키는 코드/깃엔 없음 → **Vercel 환경변수**에만, 바꾼 뒤 항상 재배포
