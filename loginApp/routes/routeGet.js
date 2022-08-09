const express = require('express');
const router = express.Router();
const client =  require('../src/db');
const authenticateToken = require('../src/authenticateToken');
const getOrSetRedis = require('../src/getOrSetRedis')

router.get('/university', authenticateToken, async (req, res) => {
  try {
    const data = await getOrSetRedis(`${req.user.name}_university`, async () => {
      return await client.query('SELECT university FROM accounts WHERE username = $1', [req.user.name]);
    })
    
    res.json(data.rows[0].university);
  } catch (error) {
    console.log(error);    
  }
});

module.exports = router;