const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const Joi = require('joi');
const baseLogger = require('../../lib/logger');
const MongoClient = require('../../lib/mongodb');
const { PRODUCT_COLLECTION } = require('../../lib/constants');

const ValidationSchemas = {
  query: Joi.object({
    typeId: Joi.string(),
    partNumber: Joi.string(),
  }).options({ allowUnknown: false }),
};

const handler = async (req, res, next) => {
  const logger = baseLogger.child({ controller: 'handler' });
  const { query } = req;
  const { typeId, partNumber } = query;
  const mongoQuery = {};

  if (typeId) mongoQuery.typeId = typeId;
  if (partNumber) mongoQuery.partNumber = partNumber;

  try {
    const response = await MongoClient.find(mongoQuery, PRODUCT_COLLECTION);
    res.status(200).json(response);
  } catch (err) {
    logger.error(err, 'handling request');
    next(err);
  }
};

module.exports = [
  validator.query(ValidationSchemas.query),
  handler,
];
