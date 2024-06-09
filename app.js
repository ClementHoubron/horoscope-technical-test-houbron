const express = require('express');
const { getSign } = require('horoscope');
const { query, validationResult } = require('express-validator');
const { swaggerUi, specs } = require('./swagger');

const app = express();
const port = process.env.PORT || 3000;

/**
 * @swagger
 * /horoscope:
 *   get:
 *     summary: Get the zodiac sign based on birthdate
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
 *                   example: Capricorn
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Birthdate is required
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid birthdate format
 */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/horoscope',
  query('birthdate').isISO8601().withMessage('Invalid birthdate format'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { birthdate } = req.query;

    try {
      const zodiacSign = getSign({ date: new Date(birthdate) });
      return res.send({ zodiacSign });
    } catch (error) {
      return res.status(500).send({ error: 'Invalid birthdate format' });
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;