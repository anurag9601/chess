import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_SERVICE_URL as string);

export default redis;