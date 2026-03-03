import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_SERVICE_URL as string);