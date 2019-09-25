const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user_id: { type: String, required: true },
  team_id: { type: String, required: true },
  msg: { type: String },
  score: {
    neg: { type: Number, required: true},
    neu: { type: Number, required: true}, 
    pos: { type: Number, required: true},
    compound: { type: Number, required: true}
  },
  created: { type: Date, default: Date.now }
});

// schema.index({ user_id: 1, team_id: 1 }, { unique: true });

module.exports = schema;

