var express = require('express')
var { requireAuth } = require('../../middlewares/requireAuth.middleware')
const orderController = require('./order.controller')
var router = express.Router()

router.get('/', orderController.getOrders)
router.post('/', orderController.addOrder)
router.put('/', requireAuth, orderController.updateOrder)

module.exports = router