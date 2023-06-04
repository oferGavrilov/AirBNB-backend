import { NextFunction, Request, Response } from "express"

var config = require('../config')
var asyncLocalStorage = require('../services/als.service')

interface IRequest extends Request {
      loggedinUser: {
            _id: string,
            fullname: string,
      }
}

function requireAuth (req: IRequest, res: Response, next: NextFunction) {
      const { loggedinUser } = asyncLocalStorage.getStore()

      if (config.isGuestMode && !loggedinUser) {
            req.loggedinUser = { _id: '', fullname: 'Guest' }
            return next()
      }
      if (!loggedinUser) return res.status(401).send('Not Authenticated')
      next()
}

module.exports = {
      requireAuth,
}
