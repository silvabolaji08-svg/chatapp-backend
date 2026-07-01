const express = require('express')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find({}).select('-password')
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

module.exports = router