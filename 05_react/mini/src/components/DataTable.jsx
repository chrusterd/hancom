import { fmtPrice, fmtClock } from '../utils/format'

// 차트와 동일한 데이터를 표로 제공한다 (툴팁 없이도 모든 값에 접근 가능)
export default function DataTable({ candles, rangeId }) {
  const rows = [...candles].reverse() // 최신순

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">시각</th>
            <th scope="col" className="num">가격 (원)</th>
            <th scope="col" className="num">직전 대비 (원)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => {
            const prev = rows[i + 1]
            const diff = prev ? c.price - prev.price : null
            const dirClass = diff > 0 ? 'pos' : diff < 0 ? 'neg' : ''
            return (
              <tr key={c.t}>
                <td>{fmtClock(c.t, rangeId)}</td>
                <td className="num">{fmtPrice(c.price)}</td>
                <td className={`num ${dirClass}`}>
                  {diff == null ? '–' : `${diff > 0 ? '+' : ''}${fmtPrice(diff)}`}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
