const request = require('supertest');
const app = require('../../app');

const productsResult = require('../resources/deleteDocResponse.json');
const mongodb = require('../../lib/mongodb');

jest.mock('../../lib/mongodb');
const mongoDbDeletedMock = mongodb.deleteOne;

beforeAll(() => {
  jest.resetModules();
});

afterAll(async () => {});

describe('Delte products', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
  });

  test('should finish successfully', async () => {
    mongoDbDeletedMock.mockResolvedValue(productsResult);
    return request(app)
      .delete('/products')
      .send({
        partNumber: 'MOCK123445PART',
      })
      .then(({ status, body }) => {
        const { acknowledged, deletedCount } = body;

        expect(status).toBe(200);
        expect(acknowledged).toBe(true);
        expect(deletedCount).toBe(1);
      })
      .then(() => {
        expect.assertions(3);
      });
  });

  test('should finish with error due to wrong body', async () => request(app)
    .delete('/products')
    .send({
      partNumbers: 'MOCK123445PART',
    })
    .then(({ status }) => {
      expect(status).toBe(400);
    })
    .then(() => {
      expect.assertions(1);
    }));
});
