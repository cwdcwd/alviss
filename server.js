'use strict';
const config = require('config');
const express = require('express');
const exphbs = require('express-handlebars');

const routeSentiment = require('./routes/sentiment');
const routeSlack = require('./routes/slack');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// CWD-- Express setup
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// CWD-- routes
app.use('/sentiment', routeSentiment);
app.use('/slack', routeSlack);


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
