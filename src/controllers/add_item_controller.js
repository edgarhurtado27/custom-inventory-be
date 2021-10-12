const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const Joi = require('joi');
const dayjs = require('dayjs');
const baseLogger = require('../../lib/logger');
const MongoClient = require('../../lib/mongodb');
const { ITEM_COLLECTION } = require('../../lib/constants');

const ValidationSchemas = {
  body: Joi.object({
    typeId: Joi.string().equal('catEntry'),
    partNumber: Joi.string().alphanum().required(),
    partNumberParent: Joi.string().alphanum().required(),
    markForDelete: Joi.boolean().required(),
    buyable: Joi.boolean().required(),
    catEntDesc: Joi.object({
      name: Joi.string().required(),
      shortDescription: Joi.string().required(),
      longDescription: Joi.string(),
    }).options({ allowUnknown: false }),
    catEntAttr: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        value: Joi.string().required(),
        description: Joi.string().required(),
      }).options({ allowUnknown: false }),
    ),
    catEntPrice: Joi.object({
      wholesale: Joi.object({
        sellPrice: Joi.string().required(),
        buyPrice: Joi.string().required(),
      }).options({ allowUnknown: false }),
      retail: Joi.object({
        sellPrice: Joi.string().required(),
        buyPrice: Joi.string().required(),
      }).options({ allowUnknown: false }),
    }).options({ allowUnknown: false }),
    qtyUnit: Joi.object({
      total: Joi.string().required(),
      onStock: Joi.string().required(),
      onPromise: Joi.string().required(),
    }).options({ allowUnknown: true }),
    extendedData: Joi.object({}).options({ allowUnknown: true }),
  }).options({ allowUnknown: false }),
};

const handler = async (req, res, next) => {
  const logger = baseLogger.child({ controller: 'handler' });
  const { body } = req;

  try {
    body.lastUpdate = dayjs().format();
    const response = await MongoClient.insertOne(body, ITEM_COLLECTION);
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
