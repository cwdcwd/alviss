'use strict';

const _ = require('lodash');
const config = require('config');
const express = require('express');
const router = express.Router()
const vader = require('vader-sentiment');


router.use('/', (req, res) => {
  let inputText = req.query.inputText || 'I love you';
  const score = vader.SentimentIntensityAnalyzer.polarity_scores(inputText);

  console.log(inputText, score);
  res.json({ inputText, score });
});

module.exports = router;