const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const Joi = require('joi');
const dayjs = require('dayjs');
const baseLogger = require('../../lib/logger');
const MongoClient = require('../../lib/mongodb');
const { PRODUCT_COLLECTION } = require('../../lib/constants');

const ValidationSchemas = {
  body: Joi.object({
    typeId: Joi.string().equal('product'),
    partNumber: Joi.string().alphanum().required(),
    markForDelete: Joi.boolean().required(),
    buyable: Joi.boolean().required(),
    prodDesc: Joi.object({
      name: Joi.string().required(),
      shortDescription: Joi.string().required(),
      longDescription: Joi.string(),
    }).options({ allowUnknown: false }),
    extendedData: Joi.object({

    }).options({ allowUnknown: true }),
  }).options({ allowUnknown: false }),
};

const handler = async (req, res, next) => {
  const logger = baseLogger.child({ controller: 'handler' });
  const { body } = req;

  try {
    body.lastUpdate = dayjs().format();
    const response = await MongoClient.insertOne(body, PRODUCT_COLLECTION);
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
