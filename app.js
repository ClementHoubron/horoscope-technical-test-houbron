const express = require('express');
const horoscope = require('horoscope');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Swagger set up
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Horoscope Express API',
      version: '1.0.0',
      description: 'A simple Express API to get zodiac sign based on birthdate',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./app.js'], // files containing annotations as above
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Horoscope:
 *       type: object
 *       required:
 *         - birthdate
 *       properties:
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The user's birthdate in YYYY-MM-DD format
 *       example:
 *         birthdate: "1990-01-01"
 */

/**
 * @swagger
 * /horoscope:
 *   get:
 *     summary: Get zodiac sign based on birthdate
 *     tags: [Horoscope]
 *     parameters:
 *       - in: query
 *         name: birthdate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: The birthdate in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: The zodiac sign
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 zodiacSign:
 *                   type: string
 *                   description: The zodiac sign
 *                   example: Capricorn
 *       400:
 *         description: Invalid birthdate format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid birthdate format
 *       500:
 *         description: Error processing the birthdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error processing the birthdate
 */

app.get('/horoscope',
  [
    check('birthdate').isISO8601().withMessage('Invalid birthdate format')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Invalid birthdate format', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    const birthdate = req.query.birthdate;
    try {
      const dateComponents = birthdate.split('-');
      const year = parseInt(dateComponents[0]);
      const month = parseInt(dateComponents[1]);
      const day = parseInt(dateComponents[2]);

      // Ensure month is in the range of 1 to 12 and day is in the range of 1 to 31
      if (month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error('Invalid birthdate');
      }

      const zodiacSign = horoscope.getSign({ month, day });
      logger.info(`Zodiac sign for birthdate ${birthdate} is ${zodiacSign}`);
      res.json({ zodiacSign });
    } catch (error) {
      logger.error('Error processing the birthdate', { error: error.message });
      res.status(500).json({ error: 'Error processing the birthdate' });
    }
  });

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;