import useDashboard from '../hooks/useDashboard'

// 차트 카드 전용: 차트/표 보기 전환
export default function ViewToggle() {
  const { state, dispatch } = useDashboard()

  return (
    <div className="segmented" role="group" aria-label="보기 방식">
      <button
        type="button"
        className={state.view === 'chart' ? 'active' : ''}
        aria-pressed={state.view === 'chart'}
        onClick={() => dispatch({ type: 'setView', view: 'chart' })}
      >
        차트
      </button>
      <button
        type="button"
        className={state.view === 'table' ? 'active' : ''}
        aria-pressed={state.view === 'table'}
        onClick={() => dispatch({ type: 'setView', view: 'table' })}
      >
        표
      </button>
    </div>
  )
}
