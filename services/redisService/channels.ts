const channels = {
  REQUEST_GLOBAL_SUMMARY: "request_global_summary",
  GLOBAL_SUMMARY_CREATED: "global_summary_created",
  //
} as const;

export default channels;
export type ChannelType = keyof typeof channels;
