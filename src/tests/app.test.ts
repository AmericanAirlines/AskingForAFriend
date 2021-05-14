/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import 'jest';
import supertest from 'supertest';
import { app } from '../app';

jest.mock('../env');

jest.spyOn(app.client.auth, 'test').mockImplementation();

describe('app', () => {
  it('returns a 200 status code for requests to /', (done) => {
    const { receiver } = require('../app');
    void supertest(receiver.app).get('/').expect(200, done);
  });

  it('returns a 404 status code for requests to unknown routes', (done) => {
    const { receiver } = require('../app');
    void supertest(receiver.app).get('/api/wafflesRgood').expect(404, done);
  });
});
