import { dbService } from '../../services/db.service'
import { ObjectId } from 'mongodb'
import { FilterOrder } from '../../models/order.model'
import { Order } from '../.././models/order.model'
import { logger } from '../../services/logger.service'

async function query(filterBy: FilterOrder) {
      try {
            const criteria = _buildCriteria(filterBy)
            const collection = await dbService.getCollection('order')
            var orders = await collection.find(criteria).toArray()
            return orders
      } catch (err) {
            logger.error('cannot find orders', err)
            throw err
      }
}

async function add(order: Order) {
      try {
            const collection = await dbService.getCollection('order')
            await collection.insertOne(order)
            return order
      } catch (err) {
            logger.error('cannot insert order', err)
            throw err
      }
}

async function update(order: Order) {
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

function _buildCriteria(filterBy: FilterOrder) {
      const criteria: any = {}
      if (filterBy.term) {
            const txtCriteria = { $regex: filterBy.term, $options: 'i' }
            criteria.$or = [
                  {
                        ['stay.name']: txtCriteria
                  },
                  {
                        ['host.fullname']: txtCriteria
                  }
            ]
      }
      if (filterBy?.hostId) criteria['host._id'] = filterBy.hostId
      if (filterBy?.buyerId) criteria['buyer._id'] = filterBy.buyerId
      if (filterBy?.status) criteria.status = filterBy.status
      if (filterBy?.stayName) criteria['stay.name'] = filterBy.stayName.replace(/amp;/g, '&')
      if (filterBy?.hostName) criteria['host.fullname'] = filterBy.hostName
      if (filterBy?.totalPrice) criteria.totalPrice = filterBy.totalPrice
      return criteria
}

export const orderService = {
      query,
      add,
      update
}