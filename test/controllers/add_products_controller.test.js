const request = require('supertest');
const app = require('../../app');

const addDocResponse = require('../resources/addDocResponse.json');
const addProdReq = require('../resources/addProdReq.json');
const mongodb = require('../../lib/mongodb');

jest.mock('../../lib/mongodb');
const mongoDbInsertMock = mongodb.insertOne;

beforeAll(() => {
  jest.resetModules();
});

afterAll(async () => {});

describe('Insert products', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test('should finish successfully', async () => {
    mongoDbInsertMock.mockResolvedValue(addDocResponse);
    return request(app)
      .post('/products')
      .send(addProdReq)
      .then(({ status, body }) => {
        const { _id } = body;

        expect(status).toBe(200);
        expect(_id).toBe('615e57a226b169d4495ba85f');
      })
      .then(() => {
        expect.assertions(2);
      });
  });
});
