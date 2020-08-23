const redis = require('../helpers/redis');
const { CONNECTION_APPROVED } = require('../constants/status');
const { AUTH_REQUEST_ERROR } = require('../constants/error');

exports.handler = ({ body }, context, callback) => {
  const { id = '' } = JSON.parse(body);
  let connected = false;

  redis.get(id, (err, value) => {
    if (err) {
      callback(AUTH_REQUEST_ERROR);
      return;
    }

    redis.quit();
    connected = value === CONNECTION_APPROVED;

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ connected }),
    });
  });
};