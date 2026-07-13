// 바이낸스 공개 WebSocket 체결(trade) 스트림 (인증 불필요)
// REST 폴링과 달리 서버가 체결이 일어날 때마다 알아서 밀어주므로,
// Upbit REST 폴링보다 훨씬 촘촘한 간격으로 시세를 받을 수 있다.
// 국내(Upbit) 코드 → 해외(Binance) 심볼 매핑. 두 거래소에 동시 상장된 자산만 연결한다.
export const SYMBOL_MAP = {
  'KRW-BTC': 'btcusdt',
  'KRW-ETH': 'ethusdt',
  'KRW-XRP': 'xrpusdt',
  'KRW-SOL': 'solusdt',
  'KRW-ADA': 'adausdt',
  'KRW-DOGE': 'dogeusdt',
}

// 스트림 메시지에 담긴 심볼(예: "BTCUSDT")로 국내 코드를 거꾸로 찾기 위한 역매핑
export const CODE_BY_SYMBOL = Object.fromEntries(
  Object.entries(SYMBOL_MAP).map(([code, sym]) => [sym.toUpperCase(), code]),
)

// combined stream: 여러 심볼의 체결을 한 소켓 연결로 함께 구독
export const STREAM_URL =
  'wss://stream.binance.com:9443/stream?streams=' +
  Object.values(SYMBOL_MAP)
    .map((s) => `${s}@trade`)
    .join('/')

