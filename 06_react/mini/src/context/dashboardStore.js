import { createContext } from 'react'

// Context 객체와 리듀서만 담는 파일 (컴포넌트는 DashboardProvider.jsx에)
export const DashboardContext = createContext(null)

export const STORAGE_KEY = 'dashboard-settings'

const DEFAULTS = {
  groupId: 'crypto', // 선택된 자산군
  market: 'KRW-BTC', // 선택된 자산
  rangeId: '24h', //    차트 조회 기간
  interval: 7, //       시세 갱신 주기(초, 최소 7초)
  view: 'chart', //     'chart' | 'table'
  theme: 'dark', //     'light' | 'dark' — 다크가 기본
}

// useReducer의 lazy init: 저장된 설정으로 기본값을 덮어써 초기 상태를 만든다
export function initSettings() {
  let saved = {}
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    // 저장값이 깨져 있으면 기본값으로 시작
  }
  return { ...DEFAULTS, ...saved }
}

export function dashboardReducer(state, action) {
  switch (action.type) {
    case 'selectMarket':
      return { ...state, market: action.market }
    case 'selectGroup':
      return { ...state, groupId: action.groupId, market: action.market }
    case 'setRange':
      return { ...state, rangeId: action.rangeId }
    case 'setInterval':
      return { ...state, interval: action.interval }
    case 'setView':
      return { ...state, view: action.view }
    case 'toggleTheme':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    default:
      throw new Error(`알 수 없는 액션: ${action.type}`)
  }
}
