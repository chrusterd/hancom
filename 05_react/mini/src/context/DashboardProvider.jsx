import { useEffect, useMemo, useReducer } from 'react'
import { DashboardContext, dashboardReducer, initSettings, STORAGE_KEY } from './dashboardStore'

export default function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, null, initSettings)

  // 테마를 <html data-theme>에 반영 → CSS 변수가 통째로 바뀐다
  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  // 설정이 바뀔 때마다 localStorage에 저장 (새로고침해도 유지)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // value 객체 재생성을 막아 불필요한 하위 리렌더를 줄인다
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
}
