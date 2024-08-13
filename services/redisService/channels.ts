const channels = {
  REQUEST_GLOBAL_SUMMARY: "request_global_summary",
  GLOBAL_SUMMARY_CREATED: "global_summary_created",
  //class based summary
  REQUEST_CLASS_BASED_SUMMARY: "request_class_based_summary",
  CLASS_BASED_SUMMARY_CREATED: "class_based_summary_created",
} as const;

export default channels;
export type ChannelType = keyof typeof channels;
