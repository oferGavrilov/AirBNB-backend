var express = require('express')
const orderController = require('./order.controller')
var router = express.Router()

router.get('/', orderController.getOrders)
router.post('/', orderController.addOrder)
router.put('/', orderController.updateOrder)

module.exports = router