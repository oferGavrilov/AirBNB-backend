var express = require('express')
// import express from 'express'
// const { getStays, getStayById, addStay, updateStay} = require('./stay.controller')
const stayController = require('./stay.controller')
const router = express.Router()

router.get('/', stayController.getStays)
router.get('/:stayId', stayController.getStayById)
router.post('/', stayController.addStay)
router.put('/:stayId', stayController.updateStay)

module.exports = router