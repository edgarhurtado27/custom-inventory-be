const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const Joi = require('joi');
const baseLogger = require('../../lib/logger');
const MongoClient = require('../../lib/mongodb');
const { ITEM_COLLECTION } = require('../../lib/constants');

const ValidationSchemas = {
  query: Joi.object({
    partNumberParent: Joi.string(),
    partNumber: Joi.string(),
  }).options({ allowUnknown: false }),
};

const handler = async (req, res, next) => {
  const logger = baseLogger.child({ controller: 'handler' });
  const { query } = req;
  const { partNumberParent, partNumber } = query;
  const mongoQuery = {};

  if (partNumberParent) mongoQuery.partNumberParent = partNumberParent;
  if (partNumber) mongoQuery.partNumber = partNumber;

  try {
    const response = await MongoClient.find(mongoQuery, ITEM_COLLECTION);
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
