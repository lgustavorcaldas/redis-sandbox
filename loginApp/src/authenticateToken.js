const jwt = require('jsonwebtoken');

module.exports =  {
  authenticateToken: (req, res, next) => {
    try {
      const { accessToken } = req.cookies;
      if( !accessToken ){
        console.error({ auth: false, errorMessage: 'No valid token provided.' });

        return res.json({ auth: false, errorMessage: 'No valid token provided.' }).status(401);
      } else {
        jwt.verify( accessToken, process.env.ACCESS_TOKEN_SECRET,
          ( error, username ) => {
            if( error ){
              console.error({ auth: false, errorMessage: 'Failed to authenticate token.' });

              return res.status(500).json({ auth: false, errorMessage: 'Failed to authenticate token.', error });
            } else {
              //  Adiciona o parametro username no objeto req!!! MUITO FODA
              req.username = username;
              console.log({ successMessage: `Trying to authenticate: ${username} was a success!` });

              return next();
            };
          }
        );
      };
    } catch (error) {
      console.error({ errorMessage: 'Trying to authenticate', error });

      return res.status(400).json({ errorMessage: 'Trying to authenticate', error });
    };
  }
};