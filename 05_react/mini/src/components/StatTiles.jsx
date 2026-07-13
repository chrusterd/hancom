import { fmtAssetPrice, fmtKRWCompact } from '../utils/format'

// 값이 오기 전에는 흐르는 스켈레톤 바로 로딩 중임을 보여준다
function StatValue({ ready, children }) {
  return ready ? children : <span className="skeleton skeleton-stat" aria-label="집계 불러오는 중" />
}

// 선택된 조회 기간의 캔들에서 집계한 거래대금·고가·저가 카드 행
export default function StatTiles({ stats, rangeLabel, asset, showVolume = true }) {
  return (
    <div className="tiles">
      <div className="tile">
        <span className="tile-label">{showVolume ? `${rangeLabel} 거래대금` : '데이터 제공처'}</span>
        <div className="tile-value">
          {showVolume
            ? <StatValue ready={Boolean(stats)}>{stats && <>{fmtKRWCompact(stats.volume)}<span className="unit">원</span></>}</StatValue>
            : asset.provider}
        </div>
      </div>

      <div className="tile">
        <span className="tile-label">{rangeLabel} 고가</span>
        <div className="tile-value">
          <StatValue ready={Boolean(stats)}>
            {stats && <>{fmtAssetPrice(stats.high, asset.currency)}<span className="unit">{asset.unit}</span></>}
          </StatValue>
        </div>
      </div>

      <div className="tile">
        <span className="tile-label">{rangeLabel} 저가</span>
        <div className="tile-value">
          <StatValue ready={Boolean(stats)}>
            {stats && <>{fmtAssetPrice(stats.low, asset.currency)}<span className="unit">{asset.unit}</span></>}
          </StatValue>
        </div>
      </div>
    </div>
  )
}
