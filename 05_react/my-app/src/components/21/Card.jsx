import './Card.css'        // 같은 폴더 CSS 가져옴

// props 3개를 구조분해로 한 번에 받음
const Card = ({ title, desc, emoji }) => {
  return (
    <div className="card">
      <span>{emoji}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  )
}
export default Card