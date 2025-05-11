// utils/redis.ts
const { createClient } = require ('redis');
const logger = require ('./logger');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

redisClient.on('connect', () => {
  logger.info('Connected to Redis');
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;