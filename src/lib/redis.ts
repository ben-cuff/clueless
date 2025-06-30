import { createClient } from "redis";

const redisLib = createClient({
  username: "default",
  password: process.env.REDIS_TOKEN,
  socket: {
    host: process.env.REDIS_HOST || "",
    port: Number(process.env.REDIS_PORT) || 31714,
  },
});

await redisLib.connect();

export default redisLib;
