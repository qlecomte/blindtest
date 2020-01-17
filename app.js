const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const knex = require('./app/database/knex')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public/player')))
app.use('/admin', express.static(path.join(__dirname, 'public/admin')))
app.use('/common', express.static(path.join(__dirname, 'public/common')))

require('./sockets/admin.socket')(io)
require('./sockets/players.socket')(io)

http.listen(3000, function () {
  console.log('listening on *:3000')
})

// module.exports = app;
