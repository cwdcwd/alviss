const config = require('config');
const mongoose = require('mongoose');

const connection = mongoose.createConnection(config.MONGODB_URL);


const models = {
  Users: connection.model('Users', require('../models/Users')),
};

const findUser = async (user) => {
  return models.Users.findOne({user_id: user.user_id });
}

const upsertUser = async (fields) => {
  return models.Users.findOneAndReplace({ user_id: fields.user_id }, fields, { upsert: true });
}

// TODO: add convienence methods here and export

module.exports = { models, findUser, upsertUser};