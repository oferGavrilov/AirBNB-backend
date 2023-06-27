import { Request } from "express"
import { ObjectId } from "mongodb"

export interface User {
    _id: ObjectId
    username: string
    fullname: string
    password?: string
    imgUrl: string
    userMsg: number
    hostMsg: number
}

export interface AuthRequest extends Request{
    loggedinUser?: {
        _id: string,
        fullname: string,
  }
}
