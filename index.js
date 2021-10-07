'use strict'

const config = require('config')
const logger = require('./lib/logger')
const stoppable = require('stoppable')
const port = config.get('api.port')

// start server
const app = require('./app')
const server = stoppable(app.listen(port, () => logger.info('%s is listening on port %s!', config.get('api.identifier'), port)))

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

// handle gracefull termination
const signals = [ 'SIGINT', 'SIGTERM', 'SIGQUIT' ]
let stopped = false
signals.forEach(signal => {
  process.on(signal, () => {
    if (!stopped) {
      stopped = true
      logger.info('%s is stopping...', config.get('api.identifier'))
      server.stop((err, success) => {
        logger.info('%s has been stopped!', config.get('api.identifier'))
      })
    }
  })
})
