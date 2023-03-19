import { Order } from "../models/order.model"

var logger = require('./logger.service')
var gIo: any = null

module.exports = {
      // set up the sockets service and define the API
      setupSocketAPI,
      // emit to everyone / everyone in a specific room (label)
      
      // emitTo,
      
      // emit to a specific user (if currently active in system)
      
      // emitToUser,

      // Send to all sockets BUT not the current socket - if found
      // (otherwise broadcast to a room / to all)
      
      // broadcast,

}

function setupSocketAPI(http: string) {
      gIo = require('socket.io')(http, {
            cors: {
                  origin: '*',
            }
      })
      gIo.on('connection', (socket:any) => {
            logger.info(`New connected socket [id: ${socket.id}]`)
            socket.on('disconnect', (socket:any) => {
                  logger.info(`Socket disconnected [id: ${socket.id}]`)
            })
            socket.on('order-coming-event', (order: Order) => {
                  logger.info(`New order invite from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  gIo.emit('order-coming-emit', (order))
            })
            socket.on('order-update-event', (order: Order) => {
                  logger.info(`New order status update from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  gIo.emit('order-update-emit', (order))
            })
            socket.on('set-user-socket', (userId:string) => {
                  logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
                  socket.userId = userId
            })
            socket.on('unset-user-socket', () => {
                  logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
                  delete socket.userId
            })

      })
}