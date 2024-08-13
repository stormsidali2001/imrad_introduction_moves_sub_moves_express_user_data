import express, { Response, Request } from "express";
import {
  IntroductionDto,
  SentenceFindParamsDto,
} from "../../validation/introduction";
import {
  createIntroduction,
  findIntroduction,
  findIntroductions,
  getIntroductionsStats,
} from "../../services/introductionService";
import { RetrieverParamsDto } from "../../validation/RetrieverParamsDto";
import { IntroductionParamsDto } from "../../validation/authParamsParserDto";
import { CreateSentenceFeedbackDto } from "../../validation/feedbackDto";
import {
  createSentenceFeedback,
  deleteFeedback,
  getPaginatedFeedbacks,
} from "../../services/feedbackService";
import { getDashboardStatsUseCase } from "../../services/use-cases/dashboard-stats";
import { z } from "zod";
import { createIntroductionUseCase } from "../../services/use-cases/create-introduction";

const introductionRouter = express.Router();

introductionRouter.post(
  "/:introductionId/sentences/:sentenceId/feedback/users/:userId",
  async (req: Request, res: Response) => {
    try {
      console.log("here 1");
      const params = await CreateSentenceFeedbackDto.parseAsync({
        ...req.params,
        ...req.body,
      });

      console.log("here", params);
      await createSentenceFeedback(params);

      res.status(201).json([]);
    } catch (err) {
      console.error(err);
      res.status(422).json(err);
    }
  },
);

introductionRouter.get("", async (req: Request, res: Response) => {
  try {
    console.log(req.params, req.query);

    const { page, search, userId } = await RetrieverParamsDto.parseAsync({
      ...req.params,
      ...req.query,
    });

    const introductions = await findIntroductions(userId, page, search);
    res.status(200).json(introductions);
  } catch (err) {
    console.error(JSON.stringify(err));
    res.status(422).json(err);
  }
});

introductionRouter.post("/", async (req: Request, res: Response) => {
  const introduction = await IntroductionDto.parseAsync(req.body);
  const isPremium = await z
    .boolean()
    .default(false)
    .parseAsync(req.body.isPremium);
  console.log(introduction);
  try {
    const introductionDb = await createIntroductionUseCase(
      introduction,
      isPremium,
    );

    res.status(201).json(introductionDb);
  } catch (err) {
    console.error(err);
    res.status(422).json({ error: err });
  }
});

introductionRouter.get("/stats", async (req: Request, res: Response) => {
  const userId = await z.string().optional().parseAsync(req.query.userId);
  const stats = await getIntroductionsStats(userId);
  res.status(200).json(stats);
});

introductionRouter.get(
  "/admin/stats/users/:userId",
  async (req: Request, res: Response) => {
    try {
      const stats = await getDashboardStatsUseCase(req.params.userId);
      res.status(200).json(stats);
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
);

introductionRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { userId, id } = await IntroductionParamsDto.parseAsync({
      ...req.query,
      ...req.params,
    });

    const introduction = await findIntroduction(id, userId);

    if (!introduction) {
      res.status(404).json({ message: "Introduction not found" });
    }
    res.status(200).json(introduction);
  } catch (err) {
    console.error(err);
  }
});

introductionRouter.get("/feedbacks", async (req: Request, res: Response) => {
  try {
    const params = await RetrieverParamsDto.parseAsync(req.query);
    const feedbacks = await getPaginatedFeedbacks(
      params.userId,
      params.page,
      params.search,
    );
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(422).json(JSON.stringify(err));
  }
});

introductionRouter.delete(
  "/:introductionId/sentences/:sentenceId/feedbacks",
  async (req: Request, res: Response) => {
    try {
      const params = await SentenceFindParamsDto.parseAsync(req.params);
      await deleteFeedback(params.introductionId, params.sentenceId);
      res.status(200).json([]);
    } catch (err) {
      console.error(err);
    }
  },
);

introductionRouter.get(
  "/dashboard/stats",

  async (req: Request, res: Response) => {
    try {
      const stats = await getDashboardStatsUseCase();
      res.status(200).json(stats);
    } catch (err) {
      console.error(err);
    }
  },
);

export default introductionRouter;
