const express = require('express')   // 꺼내고
const app = express()                // 만들고

// 고정 주소로 GET 요청 오면 전체 목록 응답
app.get('/api/users', (req, res) => {   // req=요청, res=응답
  res.json([
    { id: 1, name: 'KIM' }, 
    { id: 2, name: '철수' }
  ])   // 배열→JSON 응답 (날 데이터, 디자인 X)
})

app.listen(3000, () => console.log('http://localhost:3000'))   // 문 열기