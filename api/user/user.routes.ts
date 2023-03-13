import  express from 'express'
const userController = require('./user.controller')
var router = express.Router()

router.get('/:userId', userController.getUser)

module.exports = router