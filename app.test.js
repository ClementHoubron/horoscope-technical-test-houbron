const request = require('supertest');
const app = require('./app'); // Adjust the path as necessary

describe('GET /horoscope', () => {
  it('should return the correct zodiac sign for a valid birthdate', async () => {
    const res = await request(app)
      .get('/horoscope')
      .query({ birthdate: '1998-07-27' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('zodiacSign');
    expect(res.body.zodiacSign).toBe('Leo'); // Adjust the expected zodiac sign based on the actual implementation
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