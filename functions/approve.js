require('dotenv').config();
const unifiController = require('node-unifiapi');
const { env } = require('process');
const { DEVICE_APPROVE_AUTH_ERROR, UNIFI_API_ERROR } = require('../constants/error');
const redis = require('../helpers/redis');
const { CONNECTION_APPROVED } = require('../constants/status');

exports.handler = ({ queryStringParameters: { id = '', mac = '', key = '' } }, context, callback) => {

  if (key === env.NETWORK_DEVICE_APPROVE_KEY) {
    approve(id, mac, callback);
  } else {
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: DEVICE_APPROVE_AUTH_ERROR }),
    });
  }
};

const approve = (id, mac, callback) => {
  const unifi = unifiController({
    baseUrl: env.UNIFI_CONTROLLER_BASE_URL,
    username: env.UNIFI_CONTROLLER_USERNAME,
    password: env.UNIFI_CONTROLLER_PASSWORD,
  })

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

  return {
    statusCode: 200,
    body: JSON.stringify({ approved: 'yes' }),
  };
};
