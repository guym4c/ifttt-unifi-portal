require('dotenv').config();
const { env } = require('process');
const { Tedis } = require('tedis');

module.exports = new Tedis({
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
});
