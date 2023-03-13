var userService = require('./user.service.ts')
var logger = require('../../services/logger.service')


async function getUser(req:any, res:any) {
      try {
          const user = await userService.getById(req.params.userId)
          res.send(user)
      } catch (err) {
          logger.error('Failed to get user', err)
          res.status(500).send({ err: 'Failed to get user' })
      }
  }

module.exports = {
      getUser
}