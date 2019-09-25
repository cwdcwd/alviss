const config = require('config');
const mongoose = require('mongoose');

const connection = mongoose.createConnection(config.MONGODB_URL);

const models = {
  Users: connection.model('Users', require('../models/Users')),
  Sentiments: connection.model('Sentiments', require('../models/Sentiments'))
};

module.exports = { models };