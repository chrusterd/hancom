# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에게 제공되는 안내 문서입니다.

## 저장소 개요

이 저장소는 한국어로 진행되는 웹/AI 개발 과정(한컴 웹 개발 과정) 학습 저장소입니다. HTML/CSS → JavaScript → React → Node/Express → AI API 연동(Groq, Claude, Vercel) → Python → 컴퓨터 비전(YOLO) → 공공 API → Hugging Face/Transformers/OCR → Streamlit/Gradio 앱 순서로 진행되는, 번호가 매겨진 대부분 독립적인 학습 폴더들로 구성됩니다. 각 번호 폴더는 독립적인 모듈이며, 저장소 전체를 아우르는 공통 빌드 시스템이나 모노레포 툴링, 단일 진입점은 없습니다.

**폴더 번호는 시간이 지나며 변경되었습니다** (`04_netlify` 폴더가 새로 추가되면서 이후 폴더 번호가 모두 하나씩 밀렸습니다). 루트의 `README.md`는 현재 번호 체계로 업데이트되어 있지만, 그래도 폴더 이름을 확인할 때는 항상 실제 디스크 상의 폴더를 먼저 확인한 뒤 참조해야 합니다. 현재 번호 체계는 다음과 같습니다.

| 폴더 | 주제 |
|---|---|
| `01_vscode` | VS Code 설정, 추천 확장 프로그램 |
| `02_html` | HTML 기초 (약 34개의 독립 실습) |
| `03_css` | CSS 기초 (`01`~`19` 폴더, 각 폴더마다 `index.html` 1개) |
| `04_netlify` | Netlify 정적 호스팅 개념 (코드 없음) |
| `05_js` | 바닐라 JS 기초 (`02`~`18` 폴더) |
| `06_react` | React/Vite 앱: `my-app`(스캐폴드), `mini`(멀티에셋 대시보드) |
| `07_node_express` | Express REST API 실습 (`index_04.js`~`index_10.*`) |
| `08_groq` | Groq 기반 AI 채팅 앱 (Express 프록시 + Vercel 서버리스) |
| `09_vercel` | Vercel 프로젝트 연결 메타데이터만 존재, 앱 코드 없음 |
| `10_claude_web` | Claude로 웹 페이지 생성하는 실험 (계획 유무, 디자인 스킬, Haiku 비교) |
| `11_anaconda` | Conda/pip 가상환경 관리 노트 |
| `12_python` | 파이썬 기초 (`01`~`17` 폴더) |
| `13_data` | 이미지 데이터 수집/증강 (`cv2`, `Pillow`) |
| `14_yolo` | Ultralytics YOLO11 (`basic/`, `advanced/`: 추적, SAM, 알람 스크립트) |
| `15_openapi` | ITS CCTV 공공 API + YOLO 파이프라인 |
| `16_huggingface` | Hugging Face Inference API (DeepSeek, 이미지 생성) |
| `17_transformers` | `transformers`/`sentence-transformers` 파이프라인 |
| `18_ocr` | OCR 비교: `pytesseract` vs `easyocr` |
| `19_streamlit` | Streamlit 앱 (YOLO 웹캠 데모, 탐지+plotly 그래프) |
| `20_gradio` | Gradio 앱 (기본, 번역, YOLO, Blocks) |

## 실행 방법

저장소 루트 차원의 공통 빌드/테스트/린트 명령은 없습니다. 모든 모듈은 각자의 폴더 안에서 실행합니다.

### 정적 HTML/CSS/JS 실습 (`02_html`, `03_css`, `05_js`)
`index.html` 파일을 브라우저에서 직접 열거나 VS Code의 Live Server 확장을 사용하세요. 별도의 빌드 단계는 없습니다.

### Node/Express 프로젝트
각각 자체 `package.json`을 가지고 있으므로 먼저 해당 폴더로 이동(`cd`)해야 합니다.

- `06_react/my-app`, `06_react/mini`: `npm install` 후 `npm run dev`(Vite 개발 서버), `npm run build`, `npm run lint`, `npm run preview`.
  - `06_react/mini`는 실시간 시세 데이터를 위해 프록시 서버도 함께 실행해야 합니다: 별도 터미널에서 `npm run stock-proxy`(`127.0.0.1:8787`에서 서빙)를 `npm run dev`와 함께 실행하세요. `.env.development.local`이 필요하며, 변수명은 `06_react/mini/.env.example`(`VITE_FINNHUB_API_KEY`, `VITE_FRED_API_KEY`, `VITE_KR_STOCK_PROXY_URL`)을 참고하세요.
- `07_node_express`: `npm install` 후 실습 파일을 개별적으로 직접 실행합니다. 예: `node index_10.js`.
- `08_groq`: `npm install` 후 `server/.env`에 `GROQ_API_KEY`를 넣고 `npm start` 실행 → `http://localhost:3000`에서 서빙됩니다 (Express 프록시가 브라우저로부터 API 키를 보호). 동일한 `/api/chat` 규격을 공유하는 Vercel 서버리스 버전은 `api/chat.js`에 있습니다.

### 파이썬 스크립트 (`12_python`~`20_gradio`)
`requirements.txt`나 `environment.yml`이 저장소 어디에도 없으며, 의존성은 그때그때 conda 환경에 수동으로 설치됩니다 (이 폴더들의 VS Code 워크스페이스 설정은 기본적으로 `python-envs.defaultEnvManager: "ms-python.python:conda"`로 지정되어 있습니다). 이 폴더들에서 스크립트를 실행하기 전에 어떤 패키지를 import하는지 확인하고, 활성화된 환경에 해당 패키지가 설치되어 있는지 확인하세요.

- 대부분의 스크립트는 직접 실행합니다: `python v15_04_cctv_its_yolo.py` 등.
- `19_streamlit/*.py`: `streamlit run v19_01_streamlit_b.py`로 실행합니다.
- `20_gradio/*.py`: `python`으로 직접 실행합니다. Gradio 앱은 자체적으로 로컬 서버를 띄웁니다.
- API 키가 필요한 스크립트는 해당 폴더의 로컬 `.env`에서 `python-dotenv`로 키를 불러옵니다(아래 참고) — 키를 코드에 하드코딩하지 마세요.

## 환경 변수 / 시크릿

키가 필요한 각 폴더는 git에서 제외된 자체 `.env`를 가지고 있습니다. 일부 폴더에는 `.env.example` 템플릿이 있으니, 키가 필요한 새 스크립트를 추가할 때는 이 패턴(변수명만 기재)을 따르는 것이 좋습니다.

| 폴더 | 변수 | `.env.example` 존재 여부 |
|---|---|---|
| `06_react/mini` | `VITE_FINNHUB_API_KEY`, `VITE_FRED_API_KEY`, `VITE_KR_STOCK_PROXY_URL` | 있음 |
| `08_groq/server` | `GROQ_API_KEY` | 없음 |
| `14_yolo/advanced` | `GMAIL_FROM`, `GMAIL_APP_PASSWORD`, `GMAIL_TO` (`yolo_alarm.py`가 Gmail SMTP로 CCTV 알림 메일을 보낼 때 사용) | 없음 |
| `15_openapi` | `ITS_API_KEY` | 있음 |
| `16_huggingface` | `HF_TOKEN` | 없음 |

실제 `.env` 파일의 값을 읽거나 출력하지 마세요. 변수명만 참조하거나 문서화해야 합니다.

## 여러 부분으로 구성된 미니 프로젝트 관련 아키텍처 노트

- **`08_groq`**: 채팅 앱은 동일한 `/api/chat` 규격에 대해 두 가지 형태로 병렬 구현되어 있습니다 — `server/index.js`(로컬 Express 프록시, `npm start`에서 사용)와 `api/chat.js`(Vercel 서버리스 함수, 프로덕션에서 사용). 채팅 로직을 변경할 때는 보통 두 파일 모두에 반영해야 합니다. 클라이언트(`client/`)는 상대 경로 `/api/chat`을 호출하므로 두 환경 모두에서 코드 수정 없이 동작합니다.
- **`06_react/mini`**: 시세 데이터는 하나의 프록시 구현(`server/naver.js`)을 두 개의 다른 런타임 어댑터가 감싸는 구조입니다 — 개발용 로컬 Express 스타일 래퍼(`npm run stock-proxy`로 실행)와 Netlify 배포용 `netlify/functions/market.mjs`. 데이터 소스나 엔드포인트가 변경되면 `server/naver.js`를 수정하고 두 래퍼 모두 동일한 라우트(`/quote`, `/fx`, `/commodity`, `/candles`)를 계속 제공하는지 확인하세요. 프록시 호출이 실패한 자산은 가짜 시세를 만드는 대신 다른 소스로 폴백합니다(환율은 Frankfurter, 원자재는 FRED) — 이 코드를 수정할 때는 이 동작을 유지해야 합니다.
- **`15_openapi`**: 이 폴더의 스크립트들은 완전히 독립적이지 않고 서로 의존합니다 — `v15_04_cctv_its_yolo.py`는 `v15_03_cctv_its_def.py`의 API 호출 함수를 직접 import해서 그 결과를 YOLO 추론으로 전달합니다. 이 폴더의 스크립트를 독립 실행 파일로 취급하기 전에 파일 간 import 여부를 먼저 확인하세요.
- **`10_claude_web`**: 번호가 매겨진 각 하위 폴더는 동일한 종류의 페이지를 생성할 때 서로 다른 Claude 프롬프팅/스킬 전략(계획 없음 vs 계획 vs 계획+Q&A vs frontend-design 스킬 vs Haiku 모델)을 비교하는 통제된 실험입니다. 새로운 비교 실험을 추가할 때는 전략별로 하나의 하위 폴더를 만들고 그 안에 결과 HTML을 두는 기존 패턴을 따르세요.

## 컨벤션

- 이 저장소의 README, 주석, 기획 문서는 기본적으로 한국어로 작성됩니다. 한국어로 작성된 파일의 내용을 수정할 때는 이 언어를 맞춰서 작성하세요.
- `.gitignore`는 미디어 파일(`*.mp4/mp3/png/jpg/jpeg`), `.env`, `node_modules/`, 파이썬 캐시, YOLO 산출물(`*.pt`, `weights/`, `*_openvino_model/`)을 제외합니다. 모델 가중치 파일(`yolo11n.pt` 등)은 커밋하지 않고 로컬에서 다시 내려받거나 생성하는 것을 전제로 합니다.
