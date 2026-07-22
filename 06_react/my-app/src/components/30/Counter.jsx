import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)   // count 보관(처음 0)
  return (
    <>
      <button onClick={() => setCount(c => c - 1)}>−1</button>   {/* 내리기 (함수형) */}
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+1</button>   {/* 올리기 (함수형) */}
    </>
  )
}
export default Counter