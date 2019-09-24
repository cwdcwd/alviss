'use strict';

const _ = require('lodash');
const config = require('config');
const qs = require('qs');
const rp = require('request-promise-native');
const express = require('express');
const vader = require('vader-sentiment');

const User = require('../models/Users');

const router = express.Router();

const THRESHHOLD_NEG = -0.3;
const THRESHHOLD_POS = 0.3;

const SLACK_PARAMS_AUTH = {
  client_id: config.SLACK_CLIENTID,
  scope: config.SLACK_SCOPE,
  redirect_uri: config.SLACK_REDIRECTURL,
}

const SLACK_PARAMS_ACCESS = {
  client_id: config.SLACK_CLIENTID,
  client_secret: config.SLACK_CLIENTSECRET,
  redirect_uri: config.SLACK_REDIRECTURL,
}

const SLACK_AUTH_URL = 'https://slack.com/oauth/authorize';
const SLACK_ACCESS_URL = 'https://slack.com/api/oauth.access';

router.get('/authorize', (req, res) => {
  let params = SLACK_PARAMS_AUTH;

  if (req.query.teamId) {
    params.team = req.query.teamId;
  }

  res.redirect(`${SLACK_AUTH_URL}?${qs.stringify(params)}`);
});

router.get('/verify', (req, res) => {
  const params = SLACK_PARAMS_ACCESS;
  if (req.query.code) {
    params.code = req.query.code; // CWD-- should really implement this
  }

  let options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    uri: SLACK_ACCESS_URL,
    form: params,
    //json: true // CWD-- slack doesn't accept json for this endpoint at this time
  }
  console.log(`sending over: ${JSON.stringify(params)}`);
  rp.post(options).then((resp => {
    const accessResp = JSON.parse(resp);
    console.log(accessResp);

    User.set(_.pick(accessResp, ['access_token', 'scope', 'team_name', 'team_id']));
    await User.save();

    if (_.get(accessResp, 'ok', false) === true) {
      res.status(200);
      res.render('postInstall', { title: 'Installation Complete', team_name: accessResp.team_name });
    } else {
      res.status(500);
      res.render('error', { errMsg: accessResp.error });
    }

    return;
  })).catch((err) => {
    console.log(err);
    res.status(500);
    res.render('error', { errMsg: err.message });
    return;
  })

});

router.post('/events', (req, res) => {
  const body = req.body;

  if (body.challenge) {
    console.log('authenticating w/ slack');
    res.send(body.challenge);
    return;
  }

  if (_.get(body, 'type', null) === 'event_callback') {
    console.log(body);
    const slackEvent = body.event;

    if (_.get(slackEvent, 'type', null) === 'message') {
      const msg = _.get(slackEvent, 'text', '');
      console.log(`message is '${msg}'`);
      //separate this out to a processor
      const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(msg);
      let responseMsg = `${JSON.stringify(sentiment)}`;

      if (sentiment.compound > THRESHHOLD_POS) {
        responseMsg = 'Good positive message';
      } else if (sentiment.compound < THRESHHOLD_NEG) {
        responseMsg = 'whoa. a little negative there...';
      }

      const options = {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.SLACK_TOKEN}` },
        uri: 'https://slack.com/api/chat.postEphemeral',
        body: {
          token: slackEvent.token,
          text: responseMsg,
          channel: slackEvent.channel,
          user: slackEvent.user,
          as_user: false
        },
        json: true
      };
      console.log(options)
      const resp = rp.post(options).then((resp) => {
        console.log(resp);
        res.status(200);
        res.send();
        return;
      }).catch((err) => {
        console.log(err);
        res.status(500);
        res.json(err);
        return;
      });
    }
  }

  res.status(400);
});

module.exports = router;