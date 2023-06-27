import { NextFunction, Request, Response } from "express"
import { config } from '../config'
import { asyncLocalStorage } from '../services/als.service'
import { AuthRequest } from "../models/user.model"

export function requireAuth (req: AuthRequest, res: Response, next: NextFunction) {
      const loggedinUser = asyncLocalStorage.getStore() as { loggedinUser?: AuthRequest }
      if (config.isGuestMode && !loggedinUser) {
            req.loggedinUser = { _id: '', fullname: 'Guest' }
            return next()
      }
      if (!loggedinUser) return res.status(401).send('Not Authenticated')
      next()
}

