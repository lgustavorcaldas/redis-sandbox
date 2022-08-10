const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken){
      console.error({ auth: false, message: 'No valid token provided.' });

      return res.json({ auth: false, message: 'No valid token provided.' }).status(401);
    } else {
      jwt.verify( accessToken.split(' ')[0], process.env.ACCESS_TOKEN_SECRET,
        ( error, username ) => {
          if( error ){
            console.error({ auth: false, message: 'Failed to authenticate token.' });

            return res.status(500).json({ auth: false, message: 'Failed to authenticate token.', error });
          } else {
            //  Adiciona o parametro username no objeto req!!! MUITO FODA
            req.username = username;
            console.log({ message: `Trying to authenticate: ${username} was a success!` });

            return next();
          }
        }
      );
    }
  } catch (error) {
    console.error({ error: 'Trying to authenticate' });

    return res.status(400).json({ error: 'Trying to authenticate', error });
  }
}

module.exports = authenticateToken;