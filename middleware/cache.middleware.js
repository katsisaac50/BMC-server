const { Request, Response, NextFunction } = require('express');
const redis = require('../utils/redis');
const logger = require('../utils/logger');

const cacheResponse = (key, ttl) => {
  return async (req, res, next) => {
    try {
      const cacheKey = `${key}_${JSON.stringify(req.query)}`;
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        logger.debug(`Serving from cache: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = async (body) => {
        try {
          await redis.set(cacheKey, JSON.stringify(body), {
            EX: ttl
          });
          logger.debug(`Cached response: ${cacheKey}`);
        } catch (err) {
          logger.error('Redis cache set error:', err);
        }
        return originalJson.call(res, body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = {
  cacheResponse
};