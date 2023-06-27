import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware'
import { orderController } from './order.controller'
export const router = express.Router()

router.get('/', orderController.getOrders)
router.post('/', orderController.addOrder)
router.put('/', requireAuth, orderController.updateOrder)
