const config = require('config');
const { MongoClient } = require('mongodb');
const Constants = require('./constants');
const logger = require('./logger').child({
  lib: 'mongodb',
});

const MongoHandler = {
  client: new MongoClient(Constants.MONGODB_URL),
  collections: new Map(),
};

const initConnect = async () => {
  const dbname = config.get('services.mongodb.endpoint.database');
  logger.info(`Connect with: ${dbname}`);
  try {
    if (MongoHandler.database) return;

    await MongoHandler.client.connect();
    logger.info('Connected successfully to server');
    MongoHandler.database = MongoHandler.client.db(dbname);
  } catch (err) {
    logger.error(err, 'MongoDB connect');
    throw err;
  }
};

const openCollection = async (name) => {
  await initConnect();
  if (MongoHandler.collections.has(name)) {
    return MongoHandler.collections.get(name);
  }
  const collection = MongoHandler.database.collection(name);
  MongoHandler.collections.set(name, collection);
  return collection;
};

const find = async (query, nameCollection) => {
  logger.trace(`query : ${JSON.stringify(query)}`);
  logger.trace(`nameCollection : ${nameCollection}`);
  const result = [];
  try {
    const collection = await openCollection(nameCollection);

    const data = await collection.find(query).toArray();
    await data.forEach((doc) => {
      result.push(doc);
    });
  } catch (error) {
    logger.error(error);
  }

  logger.trace(`result : ${JSON.stringify(result)}`);
  return result;
};

const update = async (filter, query, upsert, nameCollection) => {
  logger.trace('connecting to: ', Constants.MONGODB_URL);
  logger.trace('filter: ', filter);
  logger.trace('update: ', update);
  logger.trace('nameCollection: ', nameCollection);
  let result;
  let collection;
  const options = { upsert };
  try {
    collection = await openCollection(nameCollection);

    result = await collection.updateOne(filter, query, options);
  } catch (error) {
    logger.error(error);
  }

  return result;
};

const insertOne = async (document, nameCollection) => {
  logger.trace(`document: ${JSON.stringify(document)}`);
  logger.trace(`nameCollection: ${nameCollection}`);
  let result;
  let collection;
  try {
    collection = await openCollection(nameCollection);

    result = await collection.insertOne(document);
  } catch (error) {
    logger.error(error);
  }

  return result;
};

const deleteOne = async (document, nameCollection) => {
  logger.trace(`document: ${JSON.stringify(document)}`);
  logger.trace(`nameCollection: ${nameCollection}`);
  let result;
  let collection;
  try {
    collection = await openCollection(nameCollection);

    result = await collection.deleteOne(document);
  } catch (error) {
    logger.error(error);
  }

  return result;
};

// handle gracefull termination
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
let stopped = false;
signals.forEach((signal) => {
  process.on(signal, async () => {
    if (stopped) return;

    logger.info('closing connection to mongodb');
    if (!MongoHandler.client) return;
    await MongoHandler.client.close();
    logger.info('mongo connection closed');
    MongoHandler.client = null;
    MongoHandler.database = null;
    MongoHandler.collections = null;
    stopped = true;
  });
});

module.exports = {
  find,
  update,
  insertOne,
  deleteOne,
};
