require('dotenv').config();
const { env } = require('process');
const { v4: uuid } = require('uuid');
const http = require('axios');
const redis = require('../helpers/redis');
const { APPROVAL_PENDING } = require('../constants/status');
const { AUTH_REQUEST_ERROR, INVALID_NAME_ERROR } = require('../constants/error');

exports.handler = async ({ body }) => {
  let { name = '', mac = '' } = JSON.parse(body);
  name = name.trim();
  if (name.match(/^[A-Za-z][\sA-Za-z]*$/) === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: INVALID_NAME_ERROR }),
    };
  }

  const pollId = uuid();

  try {
    await redis.set(pollId, APPROVAL_PENDING);
    await requestAuth(pollId, name, mac);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: AUTH_REQUEST_ERROR }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ pollId }),
  };
};

const requestAuth = (pollId, name, mac) => {
  const approveUrlQuery = new URLSearchParams({
    id: pollId,
    key: env.NETWORK_DEVICE_APPROVE_KEY,
    mac,
    name,
  });

  const query = new URLSearchParams({
    value1: name,
    value2: `https://${env.REACT_APP_HOST}/.netlify/functions/approve?${approveUrlQuery.toString()}`,
  });

  return http
    .get(`https://maker.ifttt.com/trigger/${env.IFTTT_EVENT_NAME}/with/key/${env.IFTTT_WEBHOOK_KEY}?${query.toString()}`);
};
