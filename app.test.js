const request = require('supertest');
const app = require('./app');
const logger = require('./logger');

describe('GET /horoscope', () => {
  beforeAll(() => {
    logger.transports.forEach((t) => (t.silent = true)); // Disable logging during tests
  });

  it('should return the correct zodiac sign for a valid birthdate', async () => {
    const res = await request(app)
      .get('/horoscope')
      .query({ birthdate: '1998-07-27' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('zodiacSign');
    expect(res.body.zodiacSign).toBe('Leo'); // Adjust based on your implementation
  });

  it('should return an error for an invalid birthdate format', async () => {
    const res = await request(app)
      .get('/horoscope')
      .query({ birthdate: 'invalid-date' });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0]).toHaveProperty('msg', 'Invalid birthdate format');
  });
});