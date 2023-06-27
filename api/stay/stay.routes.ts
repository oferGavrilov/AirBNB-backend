import express from 'express'
import { stayController } from './stay.controller'
import { requireAuth } from '../../middlewares/requireAuth.middleware'
export const router = express.Router()

router.get('/', stayController.getStays)
router.get('/length', stayController.getStaysLength)
router.get('/:stayId', stayController.getStayById)
router.post('/', stayController.addStay)
router.put('/', requireAuth, stayController.updateStay)
