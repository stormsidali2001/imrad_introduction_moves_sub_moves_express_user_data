import { createClient } from "redis";

type RedisClient = Awaited<ReturnType<typeof createClient>>;

export const getRedisClient = async () => {
  if ((global as any).redisClient) {
    console.info("returning cached redis client");
    const k = (global as any).redisClient as RedisClient;
    return k;
  }
  const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .on("ready", () => console.log("Redis client is ready"))
    .connect();
  (global as any).redisClient = client;
  return client;
};
