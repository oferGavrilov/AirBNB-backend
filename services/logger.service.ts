import fs from 'fs'
import { asyncLocalStorage } from './als.service'
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
      const store = asyncLocalStorage.getStore() as { loggedinUser?: { _id: string } }
      const userId = store?.loggedinUser?._id
      const str = userId ? `(userId: ${userId})` : ''
      line = `${getTime()} - ${level} - ${line} ${str}\n`
      console.log(line)
      fs.appendFile('./logs/backend.log', line, (err) => {
            if (err) console.log('FATAL: cannot write to log file')
      })
}

export const logger = {
      debug(...args: any[]) {
            if (process.env.NODE_NEV === 'production') return
            doLog('DEBUG', ...args)
      },
      info(...args: any[]) {
            doLog('INFO', ...args)
      },
      warn(...args: any[]) {
            doLog('WARN', ...args)
      },
      error(...args: any[]) {
            doLog('ERROR', ...args)
      }
}