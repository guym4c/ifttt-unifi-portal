require('dotenv').config();
const { env } = require('process');
const { v4: uuid } = require('uuid');
const http = require('axios');
const redis = require('../helpers/redis');
const { APPROVAL_PENDING } = require('../constants/status');
const { AUTH_REQUEST_ERROR, INVALID_NAME_ERROR } = require('../constants/error');

exports.handler = ({ body }, context, callback) => {
  let { name = '', mac = '' } = JSON.parse(body);
  name = name.trim();
  if (name.match(/^[A-Za-z][\sA-Za-z]*$/) === null) {
    callback(INVALID_NAME_ERROR);
    return;
  }

  const pollId = uuid();

  redis.set(pollId, APPROVAL_PENDING, () => {
    requestAuth(pollId, name, mac)
      .then(() => {
        redis.quit();
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ pollId }),
        });
      })
      .catch(() => {
        redis.quit();
        callback(AUTH_REQUEST_ERROR);
      });
  });
};

const requestAuth = (pollId, name, mac) => {
  const query = new URLSearchParams({
    value1: name,
    value2: `https://${env.REACT_APP_HOST}/.netlify/functions/approve?id=${pollId}&mac=${mac}&key=${env.NETWORK_DEVICE_APPROVE_KEY}`,
  });

  return http
    .get(`https://maker.ifttt.com/trigger/${env.IFTTT_EVENT_NAME}/with/key/${env.IFTTT_WEBHOOK_KEY}?${query.toString()}`);
}