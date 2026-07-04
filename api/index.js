const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '../.env') })

const authRoutes = require('../routes/auth')
const chatRoutes = require('../routes/chat')
const messageRoutes = require('../routes/message')
const userRoutes = require('../routes/user')

const app = express()

app.use(cors({ origin: '*' }))
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

module.exports = app