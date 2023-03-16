import { Stay, StayFilter } from "../../models/stay.model"

var dbService = require('../../services/db.service')
var ObjectId = require('mongodb').ObjectId
var logger = require('../../services/logger.service')

async function query(filterBy: StayFilter) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId: string) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay = collection.findOne({ _id: new ObjectId(stayId) })
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function add(stay: Stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert stay', err)
        throw err
    }
}

async function update(stay: Stay) {
    try {
        const stayToSave: any = { ...stay }
        delete stayToSave._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: new ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

function _filter(stays: Stay[], filterBy: StayFilter) {
    if (filterBy.likeByUser) stays = stays.filter(stay => stay.likedByUsers.includes(filterBy.likeByUser))
    if (filterBy.hostId) stays = stays.filter(stay => stay.host._id === filterBy.hostId)
    if (filterBy.label) stays = stays.filter(stay => stay.labels?.includes(filterBy.label))
    if (filterBy.place) {
        const regex = new RegExp(filterBy.place, 'i')
        stays = stays.filter(stay => regex.test(stay.loc.address))
    }
    return stays
}

function _buildCriteria(filterBy: StayFilter) {
    const criteria: any = {}
    if (filterBy?.place) {
        criteria['loc.address'] = { $regex: filterBy.place, $options: 'i' }
    }
    if (filterBy?.likeByUser) {
        criteria.likedByUsers = { $in: [filterBy.likeByUser] }
    }
    if (filterBy?.label) {
        criteria.labels = { $in: [filterBy.label] }
    }
    if (filterBy?.hostId) {
        criteria['host._id'] = filterBy.hostId
    }
    return criteria
}

module.exports = {
    query,
    getById,
    add,
    update,
}