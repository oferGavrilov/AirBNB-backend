import { orderService } from './order.service'
import { logger } from '../../services/logger.service'
import { Request, Response } from 'express'
import { FilterOrder } from '../../models/order.model'

async function getOrders(req: Request, res: Response) {
      try {
            logger.debug('Getting orders')
            const filterBy = req.query as FilterOrder
            const orders = await orderService.query(filterBy) 
            res.json(orders)
      } catch (err) {
            logger.error('Failed to get orders', err)
            res.status(500).send({ err: 'Failed to get orders' })
      }
}

async function addOrder(req: Request, res: Response) {
      try {
            const order = req.body
            const addedOrder = await orderService.add(order)
            res.json(addedOrder)
      } catch (err) {
            logger.error('Failed to add order', err)
            res.status(500).send({ err: 'Failed to add order' })
      }
}

async function updateOrder(req: Request, res: Response) {
      try {
            const order = req.body
            const updatedOrder = await orderService.update(order)
            res.json(updatedOrder)
      } catch (err) {
            logger.error('Failed to update order', err)
            res.status(500).send({ err: 'Failed to update order' })
      }
}

export const orderController = {
      getOrders,
      addOrder,
      updateOrder,
}