import Redis from "ioredis";

export const cache = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    connectTimeout: 2000,
    commandTimeout: 4000,
    retryStrategy: (times) => times > 5 ? null : Math.min(times * 100, 2000),
    lazyConnect: true
},{
    password: process.env.REDIS_PASS,
    connectionName: "cache",
    noDelay: true,
});

cache.on('error', (err) => console.log(err));
cache.on('connect', () => console.log('connected'));
cache.on('data', (data) => console.log(data));
