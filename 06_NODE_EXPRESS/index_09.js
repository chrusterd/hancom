const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})

const users = [{ id: 1, name: 'Jini' }]

app.get('/api/users', (req, res) => res.json(users))
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === Number(req.params.id))
    if (!user) return res.status(404).json({ message: 'not found' })
    res.json(user)
})
app.listen(3000, () => console.log('http://localhost:3000/api/users'))