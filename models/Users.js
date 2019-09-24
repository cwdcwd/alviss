const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  access_token: { type: String, required: true },
  team_name: { type: String, required: true },
  team_id: { type: String, required: true },
  scope: { type: String },
  enterprise_id: { type: String },
});

schema.index({ user_id: 1, team_id: 1 }, { unique: true });

module.exports = schema;

