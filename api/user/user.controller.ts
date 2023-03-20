var userService = require('./user.service.ts')
var logger = require('../../services/logger.service')


async function getUser(req: any, res: any) {
    try {
        const user = await userService.getById(req.params.userId)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function updateUser(req: any, res: any) {
    try {
        const user = req.body
        const fullUser = await userService.getByIdWithPassword(user._id)
        user.password = fullUser.password
        const updatedUser = await userService.update(user)
        res.send(updatedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

module.exports = {
    getUser,
    updateUser
}