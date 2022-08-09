const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  try {
    const { username } = req.body;
    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  
    res.cookie('accessToken', accessToken).sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router