const request = require('supertest');
const app = require('../../app');

const productsResult = require('../resources/productsResult.json');
const mongodb = require('../../lib/mongodb');

jest.mock('../../lib/mongodb');
const mongoDbFindMock = mongodb.find;

beforeAll(() => {
  jest.resetModules();
});

afterAll(async () => {});

describe('Get products', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test('should finish find result', async () => {
    mongoDbFindMock.mockResolvedValue(productsResult);
    return request(app)
      .get('/products')
      .query({ typeId: 'product' })
      .then(({ status, body }) => {
        const { typeId } = body[0];
        expect(status).toBe(200);
        expect(typeId).toBe('product');
      })
      .then(() => {
        expect.assertions(2);
      });
  });

  test('should finish with error due to wrong query params', async () => request(app)
    .get('/products')
    .query({ wrongquery: 'mock' })
    .then(({ status }) => {
      expect(status).toBe(400);
    })
    .then(() => {
      expect.assertions(1);
    }));
});
