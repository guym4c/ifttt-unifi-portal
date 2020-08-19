require('dotenv').config();
const unifiClient = require('node-unifi');
const { env } = require('process');

const UNIFI_API_ERROR = 'unifi_api_error';
const AUTHENTICATION_ERROR = 'could_not_authenticate';

exports.handler = (event, context, callback) => {
  const { key = '', mac = '' } = JSON.parse(event.body);

  if (key === env.NETWORK_CONNECT_KEY) {
    connect(mac, callback);
  } else {
    callback(AUTHENTICATION_ERROR);
  }
};

const connect = (mac, callback) => {
  const unifi = new unifiClient.Controller(env.UNIFI_CONTROLLER_HOSTNAME, env.UNIFI_CONTROLLER_PORT);

  unifi.login(env.UNIFI_CONTROLLER_USERNAME, env.UNIFI_CONTROLLER_PASSWORD, (err) => {
    if (err) {
      callback(UNIFI_API_ERROR);
    }

    unifi.authorizeGuest([env.UNIFI_SITE_NAME], mac, env.NETWORK_REAUTH_TIMEOUT_MINS, (err) => {
      if (err) {
        callback(UNIFI_API_ERROR);
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ connected: true }),
        });
      }
    });
  });
};
