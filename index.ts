import express, { Express, Request, Response, NextFunction } from "express";
import introductionRouter from "./routes/introductions/route";
import mongoose from "mongoose";
import { env } from "./envZod";
import { eurekaClient } from "./eureka-client";
import bodyParser from "body-parser";
import { initIntroductionSummarySubscriberUseCase } from "./services/use-cases/init-introduction-summary-subscriber";

eurekaClient.start();
mongoose
  .connect(env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

initIntroductionSummarySubscriberUseCase();
const app = express();

app.use(bodyParser({ limit: "50mb" }));
app.use((req: Request, res: Response, next: NextFunction) => {
  console.info("-----------------------------------------");

  console.info("request url", JSON.stringify(req.url));
  console.info("request params", JSON.stringify(req.params));
  console.info("request body", JSON.stringify(req.body));

  console.info("-----------------------------------------");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("Working");
});
// introductions
app.use("/introductions", introductionRouter);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
