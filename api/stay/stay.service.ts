import { Stay, StayFilter } from "../../models/stay.model"

var dbService = require('../../services/db.service')
var ObjectId = require('mongodb').ObjectId
var logger = require('../../services/logger.service')
const STAY_INCREMENT = 20

async function query(filterBy: StayFilter, index: number) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays.slice(STAY_INCREMENT * index, STAY_INCREMENT * index + STAY_INCREMENT)
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function staysLength(filterBy: StayFilter) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('stay')
        const stays = await collection.find(criteria).toArray()
        return stays.length
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
    if (filterBy?.isPetAllowed === 'true') {
        criteria.amenities = { $in: ['Pets allowed'] }
    }
    return criteria
}

export const stayService = {
    query,
    staysLength,
    getById,
    add,
    update,
}