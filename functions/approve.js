require('dotenv').config();
const unifiClient = require('node-unifi');
const { env } = require('process');
const { AUTH_REQUEST_ERROR, DEVICE_APPROVE_AUTH_ERROR, UNIFI_API_ERROR } = require('../constants/error');
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
  const unifi = new unifiClient.Controller(env.UNIFI_CONTROLLER_HOSTNAME, env.UNIFI_CONTROLLER_PORT);

  unifi.login(env.UNIFI_CONTROLLER_USERNAME, env.UNIFI_CONTROLLER_PASSWORD, (err) => {
    if (err) {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ error: UNIFI_API_ERROR }),
      });
      return;
    }

    unifi.authorizeGuest([env.UNIFI_SITE_NAME], mac, env.NETWORK_REAUTH_TIMEOUT_MINS, (err) => {
      if (err) {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({ error: UNIFI_API_ERROR }),
        });
        return;
      }

      redis.set(id, CONNECTION_APPROVED)
        .then(() => callback(null, {
          statusCode: 200,
          body: JSON.stringify({ approved: 'yes' }),
        }))
        .catch(() => callback(null, {
          statusCode: 500,
          body: JSON.stringify({ error: AUTH_REQUEST_ERROR }),
        }));
    });
  });
};
