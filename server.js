const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const messageRoutes = require('./routes/message')
const userRoutes = require('./routes/user')

dotenv.config()

const app = express()

app.use(cors({
  origin: ['https://chatapp-zeta-nine.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err))

app.use('/api/auth', authRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ChatApp backend is running!' })
})

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})