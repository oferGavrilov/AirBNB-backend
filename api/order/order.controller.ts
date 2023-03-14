const orderService = require('./order.service.ts')
var logger = require('../../services/logger.service')

async function getOrders(req: any, res: any) {
      try {
            logger.debug('Getting orders')
            const filterBy = req.query
            const orders = await orderService.query(filterBy) 
            res.json(orders)
      } catch (err) {
            logger.error('Failed to get orders', err)
            res.status(500).send({ err: 'Failed to get orders' })
      }
}

async function addOrder(req: any, res: any) {
      try {
            const order = req.body
            const addedOrder = await orderService.add(order)
            res.json(addedOrder)
      } catch (err) {
            logger.error('Failed to add order', err)
            res.status(500).send({ err: 'Failed to add order' })
      }
}

async function updateOrder(req: any, res: any) {
      try {
            const order = req.body
            const updatedOrder = await orderService.update(order)
            res.json(updatedOrder)
      } catch (err) {
            logger.error('Failed to update order', err)
            res.status(500).send({ err: 'Failed to update order' })
      }
}

module.exports = {
      getOrders,
      addOrder,
      updateOrder,
}