import { User } from "../../models/user.model"
const Cryptr = require('cryptr')
const bcrypt = require('bcrypt')
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

var userService = require('../user/user.service')
var logger = require('../../services/logger.service')

module.exports = {
      signup,
      login,
      getLoginToken,
      validateToken
}

async function login(username: string, password: string) {
      logger.debug(`auth.service - login with username: ${username}`)
      const users: User[] = await userService.getByUsername(username)
      if (!users.length) return Promise.reject('Invalid username or password')
      const match = users.find(async (user) => await bcrypt.compare(password, user.password))
      if (!match) return Promise.reject('Invalid username or password')
      delete match.password
      match._id = match._id.toString()
      return match
}

async function signup({ username, password, fullname, imgUrl }: User) {
      const saltRounds = 10

      logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
      if (!username || !password || !fullname) return Promise.reject('Missing required signup information')

      const userExist = await userService.getByUsername(username)
      if (userExist) return Promise.reject('Username already taken')

      const hash = await bcrypt.hash(password, saltRounds)
      return userService.add({ username, password: hash, fullname, imgUrl })
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
