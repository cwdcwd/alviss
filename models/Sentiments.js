const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  team_id: { type: String, required: true },
  msg: { type: String },
  score: {
    neg: { Number, required: true},
    neu: { Number, required: true}, 
    pos: { Number, required: true},
    compound: { Number, required: true}
  },
  created: { type: Date, default: Date.now }
});

schema.index({ user_id: 1, team_id: 1 }, { unique: true });

module.exports = schema;

