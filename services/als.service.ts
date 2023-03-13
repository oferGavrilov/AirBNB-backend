const { AsyncLocalStorage } = require('async_hooks')
var asyncLocalStorage = new AsyncLocalStorage()

// The AsyncLocalStorage singleton
module.exports = asyncLocalStorage