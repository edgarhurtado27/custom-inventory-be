const pino = require('pino');

const config = require('config');

const options = (config.has('logger.options')) ? ({ ...config.get('logger.options') }) : {};
options.prettyPrint = JSON.parse(options.prettyPrint);
options.timestamp = JSON.parse(options.timestamp);
const logger = pino(options);

module.exports = logger;
