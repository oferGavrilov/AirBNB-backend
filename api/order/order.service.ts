const dbService = require('../../services/db.service')
import { ObjectId } from 'mongodb'
const Order = require('../.././models/order.model')
var logger = require('../../services/logger.service')

async function query() {
      try {
            const criteria = {}
            const collection = await dbService.getCollection('order')
            var orders = await collection.find(criteria).toArray()
            return orders
      } catch (err) {
            logger.error('cannot find orders', err)
            throw err
      }
}

async function add(order: typeof Order) {
      try {
            const collection = await dbService.getCollection('order')
            await collection.insertOne(order)
            return order
      } catch (err) {
            logger.error('cannot insert order', err)
            throw err
      }
}

async function update(order: typeof Order) {
      try {
            const orderToSave = { ...order }
            delete orderToSave._id
            const collection = await dbService.getCollection('order')
            await collection.updateOne({ _id: new ObjectId(order._id) }, { $set: orderToSave })
            return order
      } catch (err) {
            logger.error(`cannot update order ${order._id}`, err)
            throw err
      }
}

module.exports = {
      query,
      add,
      update,
}