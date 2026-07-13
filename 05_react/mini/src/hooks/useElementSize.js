import { useEffect, useRef, useState } from 'react'

// ResizeObserver로 요소의 실제 픽셀 크기를 추적한다 (반응형 SVG 차트용)
export default function useElementSize() {
  const ref = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...size }
}
