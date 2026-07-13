// 로컬 개발용 시세 프록시 (npm run stock-proxy).
// 실제 로직은 server/naver.js에 있고, 배포에서는 netlify/functions/market.mjs가 같은 로직을 서빙한다.
import http from 'node:http'
import { handleRoute } from './naver.js'

const PORT = 8787

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    return res.end()
  }

  const { status, body } = req.method === 'GET'
    ? await handleRoute(url.pathname, url.searchParams)
    : { status: 405, body: { error: 'GET만 지원합니다.' } }
  res.writeHead(status, headers)
  res.end(JSON.stringify(body))
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Stock proxy listening on http://127.0.0.1:${PORT}`)
})
