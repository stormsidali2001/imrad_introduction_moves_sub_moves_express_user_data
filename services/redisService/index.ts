import { getRedisClient } from "../../redis-client";
import { IntroductionDtoType } from "../../validation/introduction";
import channels, { type ChannelType } from "./channels";

const subscribersSet = new Set();
type Listner = (message: string, channel: ChannelType) => void;
export const publishEvent = async (channel: ChannelType, message: string) => {
  const redisClient = await getRedisClient();
  const channelId = channels[channel];

  await redisClient.publish(channelId, message);
};

export const createUniqueSubscriber = async (
  channel: ChannelType,
  listener: Listner,
) => {
  const channelId = channels[channel];
  const redisClient = await getRedisClient();
  if (subscribersSet.has(channelId)) return;
  const subscriber = redisClient?.duplicate();
  subscriber.on("error", (err) => console.error(err));
  await subscriber.connect();
  //@ts-ignore
  await subscriber.subscribe(channelId, listener);
  subscribersSet.add(channelId);
};
