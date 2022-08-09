const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
  try {
    const { username } = req.body;
    const accessToken = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('accessToken', accessToken).sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router