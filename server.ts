import express from 'express'
const cors = require('cors')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
const http = require('http').createServer(app)

if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, 'public')))
} else {
      const corsOptions = {
            origin: ['http://127.0.0.1:4200', 'http://localhost:4200'],
            credentials: true
      }
      app.use(cors(corsOptions))
}

const stayRoutes = require('./api/stay/stay.routes')
const orderRoutes = require('./api/order/order.routes')
const userRoutes = require('./api/user/user.routes')
const authRoutes = require('./api/auth/auth.routes')

app.use('/api/stay', stayRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

app.get('/**', (_: any, res: any) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

var logger = require('./services/logger.service')
const port = process.env.PORT || 4200
http.listen(port, () => {
      logger.info('Server is running on port: ' + port)
})