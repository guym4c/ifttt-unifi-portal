require('dotenv').config();
const unifiController = require('node-unifiapi');
const { env } = require('process');
const { DEVICE_APPROVE_AUTH_ERROR, UNIFI_API_ERROR } = require('../constants/error');
const redis = require('../helpers/redis');
const { CONNECTION_APPROVED } = require('../constants/status');

exports.handler = async ({ queryStringParameters: { id = '', mac = '', key = '', name = '' } }) => {

  if (key !== env.NETWORK_DEVICE_APPROVE_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: DEVICE_APPROVE_AUTH_ERROR }),
    };
  }

  const unifi = unifiController({
    baseUrl: env.UNIFI_CONTROLLER_BASE_URL,
    username: env.UNIFI_CONTROLLER_USERNAME,
    password: env.UNIFI_CONTROLLER_PASSWORD,
  });

  try {
    await unifi.authorize_guest(mac, env.NETWORK_REAUTH_TIMEOUT_MINS);
    await redis.set(id, CONNECTION_APPROVED);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: UNIFI_API_ERROR }),
    };
  }

  const query = new URLSearchParams({
    approved: 'yes',
    name,
  });

  return {
    statusCode: 302,
    headers: { Location: `https://${env.REACT_APP_HOST}?${query.toString()}` },
  };
};
