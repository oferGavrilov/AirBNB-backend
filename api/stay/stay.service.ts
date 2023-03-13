const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const Stay = require('../.././models/stay.model')
var logger = require('../../services/logger.service')

async function query() {
    try {
        const criteria = {}
        const collection = await dbService.getCollection('stay')
        var stays = await collection.find(criteria).toArray()
        return stays
    } catch (err) {
        logger.error('cannot find stays', err)
        throw err
    }
}

async function getById(stayId: string) {
    try {
        const collection = await dbService.getCollection('stay')
        const stay= collection.findOne({ _id: new ObjectId(stayId) })
        console.log('stay',stay)
        return stay
    } catch (err) {
        logger.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function add(stay: typeof Stay) {
    try {
        const collection = await dbService.getCollection('stay')
        await collection.insertOne(stay)
        return stay
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(stay: typeof Stay) {
    try {
        const stayToSave = {...stay}
        delete stayToSave._id
        const collection = await dbService.getCollection('stay')
        await collection.updateOne({ _id: ObjectId(stay._id) }, { $set: stayToSave })
        return stay
    } catch (err) {
        logger.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}

module.exports = {
    query,
    getById,
    add,
    update,
}