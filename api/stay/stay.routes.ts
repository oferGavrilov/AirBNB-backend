var express = require('express')
const stayController = require('./stay.controller')
var router = express.Router()

router.get('/', stayController.getStays)
router.get('/length', stayController.getStaysLength)
router.get('/:stayId', stayController.getStayById)
router.post('/', stayController.addStay)
router.put('/', stayController.updateStay)

module.exports = router