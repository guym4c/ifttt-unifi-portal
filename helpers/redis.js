require('dotenv').config();
const { env } = require('process');
const redis = require('redis');

module.exports = redis.createClient({
  port: env.REDIS_PORT,
  host: env.REDIS_HOST,
  password: env.REDIS_PASSWORD,
});