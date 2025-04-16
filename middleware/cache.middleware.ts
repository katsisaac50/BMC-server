import { Request, Response, NextFunction } from 'express';
import redis from '../utils/redis';
import logger from '../utils/logger';

export const cacheResponse = (key: string, ttl: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cacheKey = `${key}_${JSON.stringify(req.query)}`;
      const cachedData = await redis.get(cacheKey);
      
      if (cachedData) {
        logger.debug(`Serving from cache: ${cacheKey}`);
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      // Override res.json to cache the response
      const originalJson = res.json;
      res.json = (body) => {
        redis.setex(cacheKey, ttl, JSON.stringify(body));
        return originalJson.call(res, body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};