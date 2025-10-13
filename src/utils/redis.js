const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT) || 6379,
  },
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.error("Redis connection error:", err);
});

client.connect(); 

module.exports = client;
