import { Socket, Server } from "socket.io"
import { Server as HttpServer } from "http" 
import { Order } from "../models/order.model"
import { logger } from './logger.service'

interface CustomSocket extends Socket {
  userId?: string
  myTopic?: string
}

let gIo: Server<CustomSocket> | null = null

export function setupSocketAPI(http: HttpServer) {
      gIo = new Server(http, {
            cors: {
                  origin: ['http://127.0.0.1:4200', 'http://localhost:4200'],
            }
      })
      gIo.on('connection', (socket: CustomSocket) => {
            logger.info(`New connected socket [id: ${socket.id}]`)
            socket.on('disconnect', () => {
                  logger.info(`Socket disconnected [id: ${socket.id}]`)
            })
            socket.on('order-coming-event', (order: Order) => {
                  logger.info(`New order invite from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  socket.to(order.host._id).emit('order-coming-emit', (order))
            })
            socket.on('order-update-event', (order: Order) => {
                  logger.info(`New order status update from socket [id: ${socket.id}], emitting to topic ${socket.myTopic}`)
                  socket.to(order.buyer._id).emit('order-update-emit', (order))
            })
            socket.on('set-user-socket', (userId:string) => {
                  logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
                  socket.join(userId)
                  socket.userId = userId
            })
            socket.on('unset-user-socket', () => {
                  logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
                  if(socket.userId) {
                        socket.leave(socket.userId)
                        delete socket.userId
                  }
                 
            })
      })
}