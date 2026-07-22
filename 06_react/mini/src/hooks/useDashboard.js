import { useContext } from 'react'
import { DashboardContext } from '../context/dashboardStore'

export default function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard는 DashboardProvider 안에서만 사용할 수 있습니다')
  return ctx
}
