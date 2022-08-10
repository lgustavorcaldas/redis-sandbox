const { Client } = require("pg");

const client = new Client(process.env.FUNNY_URL);

client.connect( function(error) {
  if(error) return console.error('could not connect to postgres', error);
});

module.exports = client;