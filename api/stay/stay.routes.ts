var express = require('express')
const stayController = require('./stay.controller')
var router = express.Router()

router.get('/', stayController.getStays)
router.get('/:stayId', stayController.getStayById)
router.post('/', stayController.addStay)
router.put('/:stayId', stayController.updateStay)

module.exports = router