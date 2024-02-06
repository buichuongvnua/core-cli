const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const bodyParser = require('body-parser')

const app = express()

app.use(cors({ optionsSuccessStatus: 200 }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(req.method, ' ', req.url)
  }
  next()
})
app.use(routes)

module.exports = app
