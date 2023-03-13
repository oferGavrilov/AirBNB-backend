const fs = require('fs')
var asyncLocalStorage = require('./als.service')
const utilService = require('./util.service')

const logsDir = './logs'
if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir)
}

//define the time format
function getTime() {
      let now = new Date()
      return now.toLocaleString('he')
}

function isError(e: Error) {
      return e && e.stack && e.message
}

function doLog(level: string, ...args: any[]) {

      const strs = args.map(arg =>
            (typeof arg === 'string' || isError(arg)) ? arg : JSON.stringify(arg)
      )

      var line = strs.join(' | ')
      const store = asyncLocalStorage.getStore()
      const userId = store?.loggedinUser?._id
      const str = userId ? `(userId: ${userId})` : ''
      line = `${getTime()} - ${level} - ${line} ${str}\n`
      console.log(line)
      fs.appendFile('./logs/backend.log', line, (err:Error) => {
            if (err) console.log('FATAL: cannot write to log file')
      })
}

module.exports = {
      debug(...args:string[]) {
            if (process.env.NODE_NEV === 'production') return
            doLog('DEBUG', ...args)
      },
      info(...args:string[]) {
            doLog('INFO', ...args)
      },
      warn(...args:string[]) {
            doLog('WARN', ...args)
      },
      error(...args:string[]) {
            doLog('ERROR', ...args)
      }
}