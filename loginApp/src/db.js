const { Client } = require("pg");

const client = new Client(process.env.FUNNY_URL);

client.connect(function(err) {
  if(err) return console.error('could not connect to postgres', err);
});

module.exports = client;