// Netlify Functions로 배포되는 시세 프록시.
// 프런트와 같은 도메인의 /quote, /fx, /commodity, /candles, /health 경로를 처리한다.
import { handleRoute } from '../../server/naver.js'

export default async function handler(request) {
  const url = new URL(request.url)
  const { status, body } = await handleRoute(url.pathname, url.searchParams)
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export const config = {
  path: ['/quote', '/fx', '/commodity', '/candles', '/upbit/ticker', '/upbit/candles', '/health'],
}
