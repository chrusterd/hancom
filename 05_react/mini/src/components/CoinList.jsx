import { memo } from 'react'
import { MARKETS } from '../api/upbit'
import Sparkline from './Sparkline'
import Delta from './Delta'
import { fmtPrice, fmtUsd } from '../utils/format'

const EMPTY = [] // 안정된 참조 → 데이터 없을 때도 memo가 유지되게

// React.memo: 시세가 갱신되지 않은 행은 리렌더하지 않는다
// (선택이 바뀔 때 나머지 행이 다시 그려지는 것을 막는다)
const CoinRow = memo(function CoinRow({ coin, ticker, history, selected, onSelect, overseasPrice, usdKrw }) {
  // 김치프리미엄: 국내가가 해외가(환산)보다 얼마나 비싼지. 음수면 "역프"
  const overseasKrw = overseasPrice != null ? overseasPrice * usdKrw : null
  const premium = overseasKrw && ticker ? (ticker.trade_price / overseasKrw - 1) * 100 : null

  return (
    <button
      type="button"
      className={`coin-row ${selected ? 'selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(coin.code)}
    >
      <span className="symbol-badge" aria-hidden="true">
        {coin.symbol}
      </span>
      <span className="coin-meta">
        <span className="coin-name">{coin.name}</span>
        <span className="coin-code">{coin.code}</span>
      </span>
      <span className="coin-spark">
        <Sparkline data={history} width={64} height={24} />
      </span>
      <span className="coin-nums">
        <span className="coin-price">{ticker ? fmtPrice(ticker.trade_price) : '–'}</span>
        {ticker && <Delta rate={ticker.signed_change_rate} />}
      </span>
      {overseasPrice != null && (
        <span className="coin-overseas">
          <span>바이낸스</span>
          <span>${fmtUsd(overseasPrice)}</span>
          {premium != null && (
            <span className={`premium ${premium >= 0 ? 'up' : 'down'}`}>
              {premium >= 0 ? '김프' : '역프'} {Math.abs(premium).toFixed(2)}%
            </span>
          )}
        </span>
      )}
    </button>
  )
})

export default function CoinList({ tickers, history, selected, onSelect, overseasPrices = {}, usdKrw }) {
  return (
    <aside className="card coin-list" aria-label="관심 코인 목록">
      {MARKETS.map((coin) => (
        <CoinRow
          key={coin.code}
          coin={coin}
          ticker={tickers[coin.code]}
          history={history[coin.code] ?? EMPTY}
          selected={coin.code === selected}
          onSelect={onSelect}
          overseasPrice={overseasPrices[coin.code]}
          usdKrw={usdKrw}
        />
      ))}
    </aside>
  )
}
