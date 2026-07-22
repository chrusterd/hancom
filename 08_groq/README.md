# 🤖 Groq 챗봇

Groq API(`llama-3.1-8b-instant`)를 이용한 클로드 스타일의 웹 채팅 서비스입니다.
브라우저에 API 키를 노출하지 않도록 **프록시 서버**를 두고, 대화 기록 전체를 매번 전송해 AI가 **문맥을 기억**하며 답변합니다.

```
브라우저 → (대화 기록) → 프록시 서버 → (대화 + API 키) → Groq → 답변 → 브라우저
```

## 🔗 데모

**👉 [https://groqchatbot-ten.vercel.app](https://groqchatbot-ten.vercel.app)**

설치 없이 브라우저에서 바로 사용해볼 수 있습니다. (Vercel 서버리스 함수로 배포)

## ✨ 주요 기능

- **멀티턴 대화**: 지금까지의 대화 전체(`history`)를 서버로 보내 AI가 앞의 대화를 기억
- **마크다운 렌더링**: AI 답변을 `marked` 라이브러리로 변환해 표시
- **로딩/에러 표시**: 응답 대기 중 "생각 중..." 표시, 서버 꺼짐·오류 시 안내 메시지
- **API 키 보호**: 키는 서버(.env 또는 Vercel 환경변수)에만 존재 — 브라우저에서 볼 수 없음
- **구버전 호환**: `{ prompt: "질문" }` 형식 요청도 자동 변환해서 처리

## 📁 폴더 구조

```
07_groq/
├── client/          # 프론트엔드 (정적 파일)
│   ├── index.html   # 채팅 화면
│   ├── style.css    # 말풍선 등 스타일
│   └── app.js       # 질문 전송 + 답변 렌더링
├── server/          # 로컬 개발용 Express 프록시 서버
│   └── index.js     # POST /api/chat 창구 (포트 3000)
├── api/             # Vercel 배포용 서버리스 함수
│   └── chat.js      # /api/chat 과 동일 로직
└── vercel.json      # Vercel 라우팅 설정 (client/ 정적 서빙)
```

## 🚀 로컬 실행

1. 의존성 설치

   ```bash
   npm install
   ```

2. `server/.env` 파일에 Groq API 키 저장 ([console.groq.com](https://console.groq.com)에서 발급)

   ```
   GROQ_API_KEY=여기에_발급받은_키
   ```

3. 서버 실행 후 브라우저에서 열기

   ```bash
   npm start
   # → http://localhost:3000
   ```

## ☁️ Vercel 배포

- `api/chat.js`가 자동으로 `https://내사이트.vercel.app/api/chat` 주소가 됩니다.
- Vercel 대시보드 → **Settings → Environment Variables**에 `GROQ_API_KEY`를 등록해야 합니다.
- 클라이언트는 `/api/chat` 상대 경로를 사용하므로 로컬/배포 환경 모두 코드 수정 없이 동작합니다.

## 🔌 API

### `POST /api/chat`

**요청**

```json
{
  "messages": [
    { "role": "user", "content": "안녕?" },
    { "role": "assistant", "content": "안녕하세요!" },
    { "role": "user", "content": "방금 내가 뭐라고 했지?" }
  ]
}
```

**응답**

```json
{ "reply": "\"안녕?\"이라고 하셨어요." }
```

| 상태 코드 | 의미 |
|---|---|
| 200 | 정상 응답 (`reply`) |
| 400 | 대화 내용(`messages`) 누락 |
| 405 | POST 이외의 요청 (Vercel 함수) |
| 502 | Groq가 비정상 응답을 반환 |
| 500 | 서버 내부 오류 (키 누락, 네트워크 등) |

## 🛠 기술 스택

- **프론트엔드**: HTML / CSS / Vanilla JS, marked(마크다운 렌더링)
- **백엔드**: Node.js, Express 5, dotenv, cors
- **AI**: Groq API — `llama-3.1-8b-instant`
- **배포**: Vercel (서버리스 함수 + 정적 호스팅)
