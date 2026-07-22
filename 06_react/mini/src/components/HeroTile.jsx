import useElementSize from '../hooks/useElementSize'
import Sparkline from './Sparkline'
import Delta from './Delta'
import { fmtAssetPrice } from '../utils/format'

// 첫 행 전체를 차지하는 현재가 타일 (전일 대비 기준이라 조회 기간과 무관)
// 오른쪽 실시간 그래프는 타일의 남는 폭을 꽉 채운다
export default function HeroTile({ coin, ticker, history }) {
  const { ref, width } = useElementSize()

  return (
    <div className="tile hero-tile">
      <div className="hero-info">
        <span className="tile-label">{coin.name} 현재가</span>
        <div className="tile-value big">
          {ticker
            ? <>{fmtAssetPrice(ticker.trade_price, coin.currency)}<span className="unit">{coin.unit}</span></>
            : <span className="skeleton skeleton-hero" aria-label="시세 불러오는 중" />}
        </div>
        {ticker && <Delta rate={ticker.signed_change_rate} label="전일 대비" />}
      </div>
      <div className="hero-spark" ref={ref}>
        {width > 0 && <Sparkline data={history} width={width} height={84} dotR={3.5} />}
      </div>
    </div>
  )
}
