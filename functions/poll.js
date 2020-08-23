const redis = require('../helpers/tedis');
const { CONNECTION_APPROVED } = require('../constants/status');

exports.handler = async ({ body }) => {
  const { id = '' } = JSON.parse(body);

  const value = await redis.get(id);
  const connected = value === CONNECTION_APPROVED;

  return {
    statusCode: 200,
    body: JSON.stringify({ connected }),
  };
};
