import { NextFunction, Response } from "express"
import { authService } from '../api/auth/auth.service'
import { asyncLocalStorage } from'../services/als.service'
import { AuthRequest } from "../models/user.model"

export async function setupAsyncLocalStorage (req: AuthRequest, res: Response, next: NextFunction) {
      const storage = {}
      asyncLocalStorage.run(storage, () => {
            if (!req.cookies) return next()
            const loggedinUser = authService.validateToken(req.cookies.loginToken)

            if (loggedinUser) {
                  const alsStore = asyncLocalStorage.getStore() as { loggedinUser?: AuthRequest }
                  alsStore.loggedinUser = loggedinUser
            }
            next()
      })
}
