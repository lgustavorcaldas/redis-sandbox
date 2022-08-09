const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) res.json({ auth: false, message: 'No valid token provided.' }).status(401);

    jwt.verify( accessToken.split(' ')[0], process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) return res.json({ auth: false, message: 'Failed to authenticate token.' }).status(500);
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = authenticateToken;