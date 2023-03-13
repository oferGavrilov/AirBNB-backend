import express from 'express'
import { authController } from './auth.controller'

const router = express.Router()

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/logout', authController.logout)

module.exports = router