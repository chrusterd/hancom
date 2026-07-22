// 5칸을 만들어 score보다 작으면 ⭐, 아니면 ☆
const Rating = ({ score }) => {   // props 1개: score(별 몇 개 채울지, 예: 3) — score = 0 처럼 기본값도 가능
  return (
    <div>
      {[...Array(5)].map((_, i) => (   // 빈칸 5개 배열 만들어 반복 (...=펼쳐 map 돌게 함) / _=칸의 값(undefined, 안 씀) · i=번호(0~4)
        <span key={i}>{i < score ? '⭐' : '☆'}</span>   // i가 score보다 작으면 ⭐, 아니면 ☆ (여기선 5칸 고정이라 안전, 실제 동적 목록은 고유 id 써야 함)
      ))}
    </div>
  )
}
export default Rating   // 다른 파일에서 쓰도록 내보냄