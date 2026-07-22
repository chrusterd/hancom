# 멀티 자산 라이브 대시보드

코인, 미국주식, 국내주식, 환율, 원자재 시세를 자산군별로 탐색하는 React 대시보드입니다.

## 데이터 연결

- 코인: Upbit REST + Binance WebSocket. 별도 키 없이 실시간으로 연결됩니다.
- 미국주식: 시세는 Finnhub(`VITE_FINNHUB_API_KEY`), 기간별 캔들은 네이버 프록시.
- 국내주식·환율·원자재: 네이버 금융 비공식 API를 감싸는 자체 프록시를 사용합니다 (인증 불필요).

프록시 실제 로직은 `server/naver.js` 하나이고, 실행 환경에 따라 래퍼가 다릅니다.

- 로컬 개발: `npm run stock-proxy` (127.0.0.1:8787) + `.env.development.local`
- 배포(Netlify): `netlify/functions/market.mjs`가 같은 도메인의 `/quote`, `/fx`, `/commodity`, `/candles` 경로를 서빙합니다. 저장소 연결 배포 또는 `netlify deploy` 시 자동 포함됩니다 (dist만 드래그앤드롭하면 함수가 빠져 시세가 데모로 대체됩니다).

프록시 호출이 실패한 자산은 폴백(환율 Frankfurter, 원자재 FRED)을 시도하고, 그것도 실패하면 가짜 시세를 만들지 않고 마지막 정상값 또는 `–`를 표시합니다.

> `VITE_*` 환경변수는 빌드 결과에 포함됩니다. 개인 학습용으로는 바로 연결할 수 있지만, 공개 배포에서는 Finnhub와 FRED 키도 서버 프록시를 통해 보호하는 것을 권장합니다.

## 실행

```bash
npm install
npm run stock-proxy   # 터미널 1: 시세 프록시
npm run dev           # 터미널 2: Vite 개발 서버
npm run build
```

## Vite 기본 안내

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
