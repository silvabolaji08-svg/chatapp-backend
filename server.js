const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const http = require('http')
const { Server } = require('socket.io')

const authRoutes = require('./routes/auth')
const chatRoutes = require('./routes/chat')
const messageRoutes = require('./routes/message')


dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
})

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/messages', messageRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'ChatApp backend is running!' })
})

// Socket.io
const onlineUsers = new Map()

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId

  if (userId) {
    onlineUsers.set(userId, socket.id)
    io.emit('online-users', Array.from(onlineUsers.keys()))
  }

  socket.on('join-chat', (chatId) => {
    socket.join(chatId)
  })

  socket.on('new-message', (message) => {
    socket.to(message.chatId).emit('new-message', message)
  })

  socket.on('typing', (chatId) => {
    socket.to(chatId).emit('typing')
  })

  socket.on('stop-typing', (chatId) => {
    socket.to(chatId).emit('stop-typing')
  })

  socket.on('disconnect', () => {
    onlineUsers.delete(userId)
    io.emit('online-users', Array.from(onlineUsers.keys()))
  })
})

const PORT = process.env.PORT || 5001
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})