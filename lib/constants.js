const config = require('config');

const mongodbEndpoint = config.get('services.mongodb.endpoint');
const mongodbCredentials = config.get('services.mongodb.credentials');
const mongodbCreds = mongodbCredentials.username ? `${mongodbCredentials.username}:${mongodbCredentials.password}@` : '';
const mongodbUrl = mongodbEndpoint.url || `${mongodbEndpoint.scheme}://${mongodbCreds}${mongodbEndpoint.hostname}:${mongodbEndpoint.port}/${mongodbEndpoint.database}?authSource=admin`;
const productCollection = config.get('services.mongodb.products_collection');
const itemCollection = config.get('services.mongodb.items_collection');

module.exports = {
  MONGODB_URL: mongodbUrl,
  PRODUCT_COLLECTION: productCollection,
  ITEM_COLLECTION: itemCollection,
};
