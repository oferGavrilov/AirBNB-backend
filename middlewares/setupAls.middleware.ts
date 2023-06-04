import { NextFunction, Response, Request } from "express"

const authService = require('../api/auth/auth.service')
asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage (req: Request, res: Response, next: NextFunction) {
      const storage = {}
      asyncLocalStorage.run(storage, () => {
            if (!req.cookies) return next()
            const loggedinUser = authService.validateToken(req.cookies.loginToken)

            if (loggedinUser) {
                  const alsStore = asyncLocalStorage.getStore()
                  alsStore.loggedinUser = loggedinUser
            }
            next()
      })
}

module.exports = setupAsyncLocalStorage
