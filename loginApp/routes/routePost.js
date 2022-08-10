const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const { client } =  require('../src/db');
const { rateLimiter } = require('../src/rateLimiter');
const { comparePwd } = require('../src/bcrypt');

router.post('/login', async (req, res) => {
  try {
    // Consome 1 ponto cada tentativa falha
    rateLimiter.consume(req.socket.remoteAddress)
      .then( async (connectionData) => {
        const { username, password } = req.body;
        const postgresData =  await client.query('SELECT password FROM accounts WHERE username = $1', [username]);

        if( !postgresData.rows[0] || !comparePwd(password, postgresData.rows[0].password)) {
          console.error({ errorMessage: 'Login Failed', attempts_left: connectionData.remainingPoints});

          return res.status(400).json({ errorMessage: 'Login Failed', attempts_left: connectionData.remainingPoints});
        } else {
          // Deu bom no login!
          const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
          console.log({ successMessage: `Login of ${username} was a success!` });

          return res.cookie('accessToken', accessToken, { maxAge:  2 * 60 * 60 * 1000, httpOnly: true }).json({ successMessage: 'Login success!' }).status(200);
        };
      }).catch( (rejectResponse) => {
        // Bloqueado
        const secBeforeNextTry = Math.ceil(rejectResponse.msBeforeNext / 1000) || 1;
        res.set('Retry-After', String(secBeforeNextTry));
        console.error({ successMessage: 'Too Many Requests', rejectResponse });

        return res.status(429).json({ errorMessage: 'Too Many Requests', rejectResponse  });
      });
  } catch (error) {
    console.error({ errorMessage: 'Login error!', error });

    return res.status(400).json({ errorMessage: 'Login error!', error });
  }
});

module.exports = router;