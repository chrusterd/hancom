import useDashboard from '../hooks/useDashboard'
import { fmtTime } from '../utils/format'

// API 부담을 줄이기 위해 갱신 주기는 7초 이상만 제공한다
const INTERVALS = [
  { value: 7, label: '7초' },
  { value: 10, label: '10초' },
  { value: 15, label: '15초' },
  { value: 30, label: '30초' },
]

// 원천 데이터의 갱신 속도가 정해져 있어 주기를 고를 수 없는 그룹은 실제 주기만 표시한다.
const FIXED_INTERVAL_LABELS = {
  'kr-stock': '7초 (네이버 제공 주기)',
  fx: '15초 (하나은행 고시)',
  commodity: '15초 (선물, 10분 지연)',
}

export default function Header({ dataMode, updatedAt, groupId }) {
  const { state, dispatch } = useDashboard()
  const fixedLabel = FIXED_INTERVAL_LABELS[groupId]
  // 저장된 설정이 7초 미만이면(과거 옵션) 최소값으로 끌어올려 표시한다
  const selectedInterval = Math.max(7, state.interval)

  return (
    <header className="dash-header">
      <h1 className="dash-title">멀티 자산 라이브</h1>
      {dataMode && (
        <span className={`live-badge ${dataMode === 'live' ? '' : 'sim'}`}>
          <span className="live-dot" aria-hidden="true" />
          {dataMode === 'live' ? '실시간' : '기준 시세'}
        </span>
      )}
      <div className="spacer" />
      <a className="docs-link" href="#/docs">
        📘 이 서비스에 사용한 리액트
      </a>
      {updatedAt && <span className="updated">업데이트 {fmtTime(updatedAt)}</span>}
      {fixedLabel ? (
        <span className="interval-label">
          갱신 주기 <strong className="interval-fixed">{fixedLabel}</strong>
        </span>
      ) : (
        <label className="interval-label">
          갱신 주기{' '}
          <select
            value={selectedInterval}
            onChange={(e) => dispatch({ type: 'setInterval', interval: Number(e.target.value) })}
          >
            {INTERVALS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      )}
      <button type="button" className="theme-btn" onClick={() => dispatch({ type: 'toggleTheme' })}>
        {state.theme === 'dark' ? '☀️ 라이트' : '🌙 다크'}
      </button>
    </header>
  )
}
