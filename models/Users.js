const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  access_token: { type: String, required: true },
  scope: { type: String },
  team_name: { type: String, required: true },
  team_id: { type: String, required: true }

});

// project id, provider, repositoryId must be unique
//schema.index({ access_token: 1, team_id: 1, repositoryId: 1 }, { unique: true });

module.exports = schema;

