const Badge = ({ text, type }) => {
    const color = type === 'new' ? 'green' : 'crimson'
    return (
        <span style={{ background: color, color: '#fff' }}>{text}</span>
    )   
}
export default Badge