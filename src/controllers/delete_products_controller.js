const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const Joi = require('joi');
const baseLogger = require('../../lib/logger');
const MongoClient = require('../../lib/mongodb');
const { PRODUCT_COLLECTION } = require('../../lib/constants');

const ValidationSchemas = {
  body: Joi.object({
    _id: Joi.string(),
    partNumber: Joi.string(),
  }).or('_id', 'partNumber'),
};

const handler = async (req, res, next) => {
  const logger = baseLogger.child({ controller: 'handler' });
  const { body } = req;

  try {
    const response = await MongoClient.deleteOne(body, PRODUCT_COLLECTION);
    res.status(200).json(response);
  } catch (err) {
    logger.error(err, 'handling request');
    next(err);
  }
};

module.exports = [
  validator.body(ValidationSchemas.body),
  handler,
];
