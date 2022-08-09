const express = require('express');
const app = express();
const port = 8080;
const cookieParser = require('cookie-parser');

require('dotenv').config();
app.use(express.json());
app.use(cookieParser());

const ROUTE_GET = require('./routes/routeGet');
const ROUTE_POST = require('./routes/routePost');

app.use('/', ROUTE_GET, ROUTE_POST);

app.listen(port, console.log('listen to port: ' + port));