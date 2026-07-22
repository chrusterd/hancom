import { useEffect, useState } from 'react'

// 라이브러리 없는 초간단 해시 라우팅.
// 브라우저(외부 시스템)의 hashchange 이벤트를 구독하는 useEffect의 정석 패턴이다.
export default function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
