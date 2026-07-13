import useDashboard from '../hooks/useDashboard'

// 조회 기간 선택 — 아래의 스탯 카드와 차트가 모두 이 기간을 따른다.
// 선택지는 그룹마다 다르다 (원천 데이터가 지원하는 단위가 다르므로).
export default function RangeTabs({ ranges }) {
  const { state, dispatch } = useDashboard()
  const selected = ranges.find((r) => r.id === state.rangeId) ?? ranges[0]

  return (
    <div className="range-row">
      <label className="range-label">
        조회 기간{' '}
        <select
          value={selected.id}
          onChange={(e) => dispatch({ type: 'setRange', rangeId: e.target.value })}
        >
          {ranges.map((r) => (
            <option key={r.id} value={r.id}>
              {r.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
