const express = require('express')
const router = express.Router()

router.get('/health', (req, res, next) => {
  return res.json({
    ok: true,
    timestamp: new Date().getUTCMilliseconds(),
  })
})

router.use((err, req, res, next) => {
  const { statusCode, message, details } = err
  console.log(err)
  if (!statusCode) {
    return res.status(500).json({
      message: 'Có lỗi xảy ra. Vui lòng thử lại',
    })
  }
  return res.status(statusCode).json({ message: message, details })
})

router.use((req, res, next) => {
  return res.status(404).json({ message: 'Not Found' })
})

module.exports = router
