import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { User } from "../../models/user.model"
import { userService } from '../user/user.service'
import { logger } from '../../services/logger.service'
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')


async function login(username: string, password: string) {
      logger.debug(`auth.service - login with username: ${username}`)
      const users: User[] = await userService.getByUsername(username) as User[]
      if (!users.length) return Promise.reject('Invalid username or password')
      const match = users.find(async (user) => bcrypt.compare(password, user.password as string))
      if (!match) return Promise.reject('Invalid username or password')
      delete match.password
      match._id = match._id
      return match
}

async function signup(user: User) {
      const saltRounds = 10
      logger.debug(`auth.service - signup with username: ${user.username}, fullname: ${user.fullname}`)
      if (!user.username || !user.password || !user.fullname) return Promise.reject('Missing required signup information')
      const usersExist = await userService.getByUsername(user.username)
      if (usersExist.length) return Promise.reject('Username already taken')
      const hash = await bcrypt.hash(user.password, saltRounds)
      user.password = hash
      return userService.add(user)
}

function getLoginToken(user: User) {
      const userInfo = { _id: user._id, fullname: user.fullname }
      return cryptr.encrypt(JSON.stringify(userInfo))
}

function validateToken(loginToken: string) {
      try {
            const json = cryptr.decrypt(loginToken)
            const loggedinUser = JSON.parse(json)
            return loggedinUser
      } catch (err) {
            console.log('Invalid login token')
      }
      return null
}

export const authService = {
      signup,
      login,
      getLoginToken,
      validateToken
}