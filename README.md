# hancom

한컴 웹 개발 과정 학습 저장소입니다. HTML/CSS부터 JavaScript, React, Node.js/Express, AI API 연동까지 단계별 실습 코드와 미니 프로젝트를 담고 있습니다.

> https://github.com/chrusterd/hancom

## 폴더 구성

| 폴더 | 내용 |
|------|------|
| [01_vscode](01_vscode/) | VS Code 사용법, 마크다운 기초 |
| [02_HTML](02_HTML/) | HTML 기초 실습 (태그, 폼, 시맨틱 구조 등 30여 개 예제) |
| [03_CSS](03_CSS/) | CSS 실습 (선택자, 박스 모델, flex/grid 레이아웃 등 19개 단원) |
| [04_JS](04_JS/) | JavaScript 기초~활용 (변수, 함수, DOM, 이벤트 등 18개 단원) |
| [05_react](05_react/) | React 실습 및 프로젝트 |
| [06_NODE_EXPRESS](06_NODE_EXPRESS/) | Node.js + Express 서버 실습 |
| [07_groq](07_groq/) | Groq AI API 연동 채팅 앱 |

## 미니 프로젝트

### 🕹️ HTML/CSS 리뷰 페이지 — [03_CSS/19](03_CSS/19/)
HTML/CSS 핵심 개념 복습을 레트로 픽셀 게임 스타일로 꾸민 원페이지 사이트. 픽셀 폰트(Galmuri), CSS 애니메이션(반짝임·회전·티커), 윈도우 UI 프레임 등 순수 CSS 기법 총정리.

### 🎰 MORNING SLOT — [04_JS/18-1](04_JS/18-1/)
슬롯머신을 돌려 오늘의 컬러·아침 메뉴·음악 장르를 무작위로 추천받는 인터랙티브 웹사이트. HTML + CSS + JavaScript만으로 제작.

### 📈 멀티에셋 마켓 대시보드 — [05_react/mini](05_react/mini/)
코인(업비트·바이낸스) 등 여러 자산의 시세를 한눈에 보는 React(Vite) 대시보드. 컴포넌트/훅/컨텍스트 구조 분리, Netlify 배포.

### 🪑 교실 배치도 — [06_NODE_EXPRESS](06_NODE_EXPRESS/) (index_10)
수강생 20명의 자리 배치를 관리하는 웹앱. REST API(GET/POST/PUT/DELETE)로 학생 데이터를 CRUD하고, 드래그 앤 드롭으로 자리를 교환하면 서버 id가 함께 갱신됨. 3초 폴링으로 자동 새로고침.

### 💬 AI 채팅 — [07_groq](07_groq/)
Express 프록시 서버가 API 키를 보관하고 Groq(llama-3.1)에 대신 질문하는 구조의 채팅 앱. 클로드 스타일 UI + 마크다운 응답 렌더링.

```
07_groq/
├── client/   # 채팅 UI (html/css/js)
└── server/   # Express 프록시 (.env에 API 키)
```

실행: `cd 07_groq && npm start` 후 http://localhost:3000 접속

## 학습 순서

1. **01_vscode → 02_HTML → 03_CSS** : 마크업과 스타일 기초
2. **04_JS** : 프로그래밍 기초와 DOM 조작, 미니 프로젝트로 마무리
3. **05_react** : 컴포넌트 기반 개발, Vite 프로젝트 구성과 배포
4. **06_NODE_EXPRESS** : 백엔드 서버와 REST API, fetch로 프론트–서버 연동
5. **07_groq** : 외부 AI API 연동과 프록시 서버 패턴
