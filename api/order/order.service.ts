const dbService = require('../../services/db.service')
import { ObjectId } from 'mongodb'
import { FilterOrder } from '../../models/order.model'
const Order = require('../.././models/order.model')
var logger = require('../../services/logger.service')

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

// private _filter(orders: Order[], filterBy: FilterOrder) {
//       console.log(filterBy)
//       if (filterBy.term) {
//         const regex = new RegExp(filterBy.term, 'i')
//         orders = orders.filter(order => regex.test(order.stay.name) || regex.test(order.host.fullname))
//       }
//       if (filterBy.hostId) orders = orders.filter(order => order.host._id === filterBy.hostId)
//       if (filterBy.buyerId) orders = orders.filter(order => order.buyer._id === filterBy.buyerId)
//       if (filterBy.status) orders = orders.filter(order => order.status === filterBy.status)
//       if (filterBy.stayName) orders = orders.filter(order => order.stay.name === filterBy.stayName)
//       if (filterBy.hostName) orders = orders.filter(order => order.host.fullname === filterBy.hostName)
//       if (filterBy.totalPrice) orders = orders.filter(order => order.totalPrice === filterBy.totalPrice)
//       return orders
//     }
//   }

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
      if (filterBy?.stayName) criteria['stay.name'] = filterBy.stayName
      if (filterBy?.hostName) criteria['host.fullname'] = filterBy.hostName
      if (filterBy?.totalPrice) criteria.totalPrice = filterBy.totalPrice
      return criteria
  }

module.exports = {
      query,
      add,
      update,
}