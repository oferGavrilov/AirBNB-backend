const { AsyncLocalStorage } = require('async_hooks')
var asyncLocalStorage = new AsyncLocalStorage()

module.exports = asyncLocalStorage