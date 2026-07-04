const express = require('express')
const Chat = require('../models/Chat')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()


router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name email avatar online')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })

    return res.json(chats)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.post('/', protect, async (req, res) => {
  try {
    const { userId } = req.body

    let chat = await Chat.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, userId] },
    })
      .populate('participants', 'name email avatar online')
      .populate('latestMessage')

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        participants: [req.user._id, userId],
      })
      chat = await Chat.findById(chat._id)
        .populate('participants', 'name email avatar online')
    }

    return res.json(chat)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})


router.post('/group', protect, async (req, res) => {
  try {
    const { name, participants } = req.body

    const chat = await Chat.create({
      name,
      isGroup: true,
      participants: [...participants, req.user._id],
      admin: req.user._id,
    })

    const fullChat = await Chat.findById(chat._id)
      .populate('participants', 'name email avatar online')

    return res.json(fullChat)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router