const express = require('express');
const jwt = require('jsonwebtoken');
const client =  require('../src/db');
const Redis = require('ioredis');

const redis = Redis.createClient();
const router = express.Router();

const { comparePwd } = require('../src/bcrypt');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterRedis({
  redis: redis,
  points: 5, // 5 pontos
  duration: 15 * 60,
  blockDuration: 15 * 60,
});

router.post('/login', async (req, res) => {
  try {
    // Consome 1 ponto cada tentativa falha
    rateLimiter.consume(req.connection.remoteAddress)
      .then( async (connectionData) => {
        const { username, password } = req.body;
        const postgresData =  await client.query('SELECT password FROM accounts WHERE username = $1', [username]);

        if( !postgresData.rows[0] || !comparePwd(password, postgresData.rows[0].password)) {
          console.error({ error: 'Username not found!', attempts_left: connectionData.remainingPoints});

          return res.status(400).json({ error: 'Login Failed', attempts_left: connectionData.remainingPoints});
        } else {
          // Deu bom no login!
          const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
          console.log({ message: `Login of ${username} was a success!` });

          return res.cookie('accessToken', accessToken).json({ message: 'Login success!' }).status(200);
        }
      }).catch( (rejectResponse) => {
        // Bloqueado
        const secBeforeNextTry = Math.ceil(rejectResponse.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secBeforeNextTry));
        console.error({ message: 'Too Many Requests' });

        return res.status(429).json({ error: 'Too Many Requests' });
      });
  } catch (error) {
    console.error({ error: 'Login error!', error });

    return res.status(400).json({ error: 'Login error!', error });
  }
});

module.exports = router