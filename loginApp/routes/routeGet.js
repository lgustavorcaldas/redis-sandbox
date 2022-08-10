const express = require('express');
const router = express.Router();

const { client } =  require('../src/db');
const { authenticateToken } = require('../src/authenticateToken');
const { getOrSetCache } = require('../src/getOrSetCache')

router.get('/university', authenticateToken, async (req, res) => {
  try {
    const { username } = req;
    const data = await getOrSetCache(`${username}_university`, async () => {
      return await client.query('SELECT university FROM accounts WHERE username = $1', [username]);
    });
    console.log({ successMessage: `Getting university of ${username} was a success!` });
    
    return res.status(200).json(data.rows[0].university);
  } catch (error) {
    console.error({ errorMessage: 'Getting university got a error!', error });

    return res.status(400).json({ errorMessage: 'Getting university got a error!', error });  
  }
});

module.exports = router;