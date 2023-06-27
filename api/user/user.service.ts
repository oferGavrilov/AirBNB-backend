import { ObjectId } from 'mongodb';
import { User } from "../../models/user.model"
import { dbService } from '../../services/db.service'
import { logger } from '../../services/logger.service'
    
async function query() {
      try {
            const collection = await dbService.getCollection('user')
            const users: User[] = await collection.find().toArray() as User[]
            const sanitizedUsers = users.map(user => {
                  delete user.password
                  return user
            })
            return sanitizedUsers
      } catch (err) {
            logger.error('cannot find users', err)
            throw err
      }
}

async function getById(userId: string) {
      try {
            const collection = await dbService.getCollection('user')
            const user = await collection.findOne({ _id: new ObjectId(userId) })
            if(user) delete user.password
            return user
      } catch (err) {
            logger.error(`while finding user by id: ${userId}`, err)
            throw err
      }
}

async function getByUsername(username: string) {
      try {
            const collection = await dbService.getCollection('user')
            const users = await collection.find({ username }).toArray()
            return users
      } catch (err) {
            logger.error(`while finding user by username: ${username}`, err)
            throw err
      }
}

async function update(user: User) {
      try {
            const userToSave: any = { ...user }
            delete userToSave._id
            const collection = await dbService.getCollection('user')
            await collection.updateOne({ _id: new ObjectId(user._id) }, { $set: userToSave })
            return user
      } catch (err) {
            logger.error(`cannot update user ${user._id}`, err)
            throw err
      }
}

async function add(user: User) {
      try {
            const userToAdd = { ...user }
            const collection = await dbService.getCollection('user')
            await collection.insertOne(userToAdd)
            return userToAdd
      } catch (err) {
            logger.error('cannot add user', err)
            throw err
      }
}

export const userService = {
      query,
      add,
      update,
      getById,
      getByUsername
}