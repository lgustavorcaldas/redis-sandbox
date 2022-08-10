const { Client } = require("pg");
const client = new Client(process.env.FUNNY_URL);

client.connect( function(error) {
  if( error ) {
    console.error({ errorMessage: 'Could not connect to postgres', error });

    return error;
  };
});

module.exports = { client };