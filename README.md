# hancom

한컴 웹 개발 과정 학습 저장소입니다. HTML/CSS부터 JavaScript, React, Node.js/Express, AI API 연동까지 단계별 실습 코드와 미니 프로젝트를 담고 있습니다.

> https://github.com/chrusterd/hancom

## 폴더 구성

> ⚠️ **폴더 번호는 시간이 지나며 변경되었습니다.** `04_netlify`가 새로 추가되며 이후 폴더 번호가 하나씩 밀렸습니다. 아래 표는 실제 디스크 상의 현재 폴더명 기준이며, 폴더 이름을 참조할 때는 항상 실제 폴더를 먼저 확인하세요.

| 폴더 | 내용 |
|------|------|
| [01_vscode](01_vscode/) | VS Code 사용법, 마크다운 기초 |
| [02_html](02_html/) | HTML 기초 실습 (태그, 폼, 시맨틱 구조 등 30여 개 예제) |
| [03_css](03_css/) | CSS 실습 (선택자, 박스 모델, flex/grid 레이아웃 등 19개 단원) |
| [04_netlify](04_netlify/) | Netlify 배포 실습 |
| [05_js](05_js/) | JavaScript 기초~활용 (변수, 함수, DOM, 이벤트 등 18개 단원) |
| [06_react](06_react/) | React 실습 및 프로젝트 |
| [07_node_express](07_node_express/) | Node.js + Express 서버 실습 |
| [08_groq](08_groq/) | Groq AI API 연동 채팅 앱 |
| [09_vercel](09_vercel/) | Vercel 배포 설정 |
| [10_claude_web](10_claude_web/) | Claude로 웹 페이지 생성 실습 (계획 유무, 프론트엔드 디자인 스킬, Haiku 등 단계별 비교) |
| [11_anaconda](11_anaconda/) | Anaconda/pip 가상환경 및 패키지 관리 (pipreqs 등) |
| [12_python](12_python/) | 파이썬 기초 학습 (변수~람다, 17개 단원) |
| [13_data](13_data/) | Pillow/OpenCV 기반 이미지 데이터 수집·증강 |
| [14_yolo](14_yolo/) | Ultralytics YOLO11 실습 (탐지·분류·분할·포즈·카운팅·실시간 추적) |
| [15_openapi](15_openapi/) | 공공 OpenAPI(ITS CCTV) 연동, API 키 .env 분리, YOLO 연계 실습 |
| [16_huggingface](16_huggingface/) | HuggingFace 연동 (DeepSeek 텍스트 생성, Text-to-Image) |
| [17_transformers](17_transformers/) | Transformers 파이프라인 (유사도, 감성분석, 생성, 요약, 번역) |
| [18_ocr](18_ocr/) | pytesseract/EasyOCR 기반 이미지 OCR 실습 |
| [19_streamlit](19_streamlit/) | Streamlit 대시보드/그래프 실습 |
| [20_gradio](20_gradio/) | Gradio 데모 앱 (번역, YOLO, Blocks UI) |

## 미니 프로젝트

### 🕹️ HTML/CSS 리뷰 페이지 — [03_css/19](03_css/19/)
HTML/CSS 핵심 개념 복습을 레트로 픽셀 게임 스타일로 꾸민 원페이지 사이트. 픽셀 폰트(Galmuri), CSS 애니메이션(반짝임·회전·티커), 윈도우 UI 프레임 등 순수 CSS 기법 총정리.

### 🎰 MORNING SLOT — [05_js/18-1](05_js/18-1/)
슬롯머신을 돌려 오늘의 컬러·아침 메뉴·음악 장르를 무작위로 추천받는 인터랙티브 웹사이트. HTML + CSS + JavaScript만으로 제작.

### 📈 멀티에셋 마켓 대시보드 — [06_react/mini](06_react/mini/)
코인(업비트·바이낸스) 등 여러 자산의 시세를 한눈에 보는 React(Vite) 대시보드. 컴포넌트/훅/컨텍스트 구조 분리, Netlify 배포.

### 🪑 교실 배치도 — [07_node_express](07_node_express/) (index_10)
수강생 20명의 자리 배치를 관리하는 웹앱. REST API(GET/POST/PUT/DELETE)로 학생 데이터를 CRUD하고, 드래그 앤 드롭으로 자리를 교환하면 서버 id가 함께 갱신됨. 3초 폴링으로 자동 새로고침.

### 💬 AI 채팅 — [08_groq](08_groq/)
Express 프록시 서버가 API 키를 보관하고 Groq(llama-3.1)에 대신 질문하는 구조의 채팅 앱. 클로드 스타일 UI + 마크다운 응답 렌더링.

```
08_groq/
├── client/   # 채팅 UI (html/css/js)
└── server/   # Express 프록시 (.env에 API 키)
```

실행: `cd 08_groq && npm start` 후 http://localhost:3000 접속

## 학습 순서

1. **01_vscode → 02_html → 03_css** : 마크업과 스타일 기초
2. **04_netlify** : 정적 사이트 배포 실습
3. **05_js** : 프로그래밍 기초와 DOM 조작, 미니 프로젝트로 마무리
4. **06_react** : 컴포넌트 기반 개발, Vite 프로젝트 구성과 배포
5. **07_node_express** : 백엔드 서버와 REST API, fetch로 프론트–서버 연동
6. **08_groq** : 외부 AI API 연동과 프록시 서버 패턴
7. **09_vercel → 10_claude_web** : 프로젝트 배포와 AI 기반 웹 페이지 생성 실습
8. **11_anaconda → 12_python** : 파이썬 개발 환경 구성과 기초 문법
9. **13_data → 14_yolo** : 이미지 데이터 수집/증강과 YOLO11 객체 탐지·추적
10. **15_openapi** : 공공 OpenAPI 연동과 YOLO 결합 실습
11. **16_huggingface → 17_transformers** : HuggingFace 모델 활용과 Transformers 파이프라인
12. **18_ocr** : 이미지 OCR 실습
13. **19_streamlit → 20_gradio** : 파이썬 기반 웹 데모/대시보드 제작
