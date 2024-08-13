import { Eureka } from "eureka-js-client";
import { env } from "../envZod";

function getEureka() {
  const client = new Eureka({
    // application instance information
    instance: {
      app: "user-data-service",
      hostName: "localhost",
      statusPageUrl: `http://localhost:${env.PORT}/info`,
      port: {
        $: env.PORT,
        "@enabled": true,
      },
      ipAddr: "127.0.0.1",
      vipAddress: "jq.test.something.com",
      dataCenterInfo: {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
      },
    },
    eureka: {
      // eureka server host / port
      host: "0.0.0.0",
      port: 8761,
      servicePath: "/eureka/apps/",
    },
  });
  console.log("starting client  .....");
  client.start();

  console.log(" client  started.....");
  return client;
}

export const eurekaClient: Eureka = (global as any).eurekaClient ?? getEureka();
(global as any).eurekaClient = eurekaClient;
