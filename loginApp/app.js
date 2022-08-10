require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json(), cookieParser());

const ROUTE_GET_UNIVERSITY = require('./routes/routeGet');
const ROUTE_POST_LOGIN = require('./routes/routePost');

app.use('/', ROUTE_GET_UNIVERSITY, ROUTE_POST_LOGIN);

app.listen(port, console.log('listen to port: ' + port));