const stayService = require('./stay.service.ts')
var logger = require('../../services/logger.service')

async function getStays(req: any, res: any) {
      try {
            const filterBy = req.query
            logger.debug('Getting stays')
            const stays = await stayService.query(filterBy) 
            res.json(stays)
      } catch (err) {
            logger.error('Failed to get stays', err)
            res.status(500).send({ err: 'Failed to get stays' })
      }
}

async function getStayById(req: any, res: any) {
      try {
            const stayId = req.params.stayId
            const stay = await stayService.getById(stayId)
            res.json(stay)
      } catch (err) {
            logger.error('Failed to get stay', err)
            res.status(500).send({ err: 'Failed to get stay' })
      }
}

async function addStay(req: any, res: any) {
      try {
            const stay = req.body
            const addedStay = await stayService.add(stay)
            res.json(addedStay)
      } catch (err) {
            logger.error('Failed to add stay', err)
            res.status(500).send({ err: 'Failed to add stay' })
      }
}

async function updateStay(req: any, res: any) {
      try {
            const stay = req.body
            const updatedStay = await stayService.update(stay)
            res.json(updatedStay)
      } catch (err) {
            logger.error('Failed to update stay', err)
            res.status(500).send({ err: 'Failed to update stay' })
      }
}

module.exports = {
      getStays,
      getStayById,
      addStay,
      updateStay,
}