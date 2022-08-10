const Redis = require('ioredis');
const redis = Redis.createClient();
const { RateLimiterRedis } = require('rate-limiter-flexible');

module.exports= {
  rateLimiter: new RateLimiterRedis({
    redis: redis,
    points: 5, // 5 pontos
    duration: 15 * 60,
    blockDuration: 15 * 60,
  })
};