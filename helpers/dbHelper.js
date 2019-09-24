const config = require('config');
const mongoose = require('mongoose');

const connection = mongoose.createConnection(config.MONGODB_URL);


const models = {
  Users: connection.model('Users', require('../models/Users')),
};

// TODO: add convienence methods here and export

module.exports = {models};