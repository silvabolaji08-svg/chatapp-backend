const express = require('express')
const Message = require('../models/Message')
const Chat = require('../models/Chat')
const { protect } = require('../middleware/auth')

const router = express.Router()


router.get('/:chatId', protect, async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 })

    return res.json(messages)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.post('/', protect, async (req, res) => {
  try {
    const { chatId, content } = req.body

    if (!chatId || !content) {
      return res.status(400).json({ message: 'chatId and content are required' })
    }

    const message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId,
    })

    const fullMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id })

    return res.json(fullMessage)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router