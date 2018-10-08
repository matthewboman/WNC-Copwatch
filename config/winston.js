const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf } = format
require('dotenv').config()

const standardLog = printf(info => `${info.timestamp}  [${info.level.toUpperCase()}] : ${info.message}`)

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    standardLog
  ),
  transports: [
    new transports.File({ filename: process.env.COMBINED_LOG }),
  ],
  exitOnError: false
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }))
}

logger.stream = {
  write: (msg, encoding) => {
    logger.info(msg)
  }
}

module.exports = logger
