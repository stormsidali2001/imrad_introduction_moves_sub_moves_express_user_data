import { PAGE_SIZE } from "../globals";
import introductionModel from "../models/introductions";
import {
  CreateSentenceFeedbackDto,
  FeedbackDto,
  SentenceFeedbackDto,
} from "../validation/feedbackDto";

import { IntroductionDto } from "../validation/introduction";
import { RetrieverParamsDto } from "../validation/RetrieverParamsDto";
import { getPaginatedResults } from "../validation/paginatedDtoMaker";

export const createSentenceFeedback = async ({
  feedback,
  sentenceId,
  introductionId,
}: CreateSentenceFeedbackDto) => {
  const introduction = await introductionModel.findById(introductionId);
  if (!introduction) {
    throw new Error("Introduction not found");
  }
  const sentence = introduction.sentences.find(
    (s) => s.id.toString() === sentenceId,
  );
  if (!sentence) {
    throw new Error("Sentence not found");
  }
  sentence.feedback = {
    correctMove: feedback.correctMove,
    liked: feedback.liked,
    reason: feedback.reason,
    correctSubMove: feedback.correctSubMove,
    username: feedback.username,
    image: feedback.image,
  };
  await introduction.save();
};
export async function getPaginatedFeedbacks(
  userId?: string,
  page: number = 1,
  search?: string,
) {
  try {
    // First, get the total count of feedbacks that match the criteria

    const total = await getFeedbackCount(userId, search);
    if (total === 0)
      return getPaginatedResults(
        {
          data: [],
          page,
          per_page: PAGE_SIZE,
          total,
          total_pages: Math.ceil(total / PAGE_SIZE),
        },
        SentenceFeedbackDto,
      );

    // Get the paginated results

    console.log("query to get the feedbacks");
    const result = await introductionModel
      .aggregate([
        { $unwind: "$sentences" },
        { $unwind: "$sentences.feedback" },
        {
          $match: {
            ...(userId && { userId }),
            ...(search && {
              "sentences.text": { $regex: search, $options: "i" },
            }),
            // filter introduction with undefined feedback
            "sentences.feedback": {
              $exists: true,
            },
          },
        },
        { $sort: { "sentences.feedback._id": -1 } },
        { $skip: (page - 1) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
        {
          $project: {
            _id: 1,
            feedback: "$sentences.feedback",
            sentenceText: "$sentences.text",
            sentenceId: "$sentences._id",
            move: "$sentences.move",
            subMove: "$sentences.subMove",
          },
        },
      ])
      .exec();

    console.log("feedback raw results :", result);
    const feedbacksData = result.map((r) => ({
      ...r,
      sentenceId: r.sentenceId.toString(),
      introductionId: r._id.toString(),
    }));

    return getPaginatedResults(
      {
        data: feedbacksData,
        page,
        per_page: PAGE_SIZE,
        total,
        total_pages: Math.ceil(total / PAGE_SIZE),
      },
      SentenceFeedbackDto,
    );
  } catch (error) {
    console.error("Error retrieving paginated feedbacks:", error);
    throw error;
  }
}

export async function getFeedbackCount(userId?: string, search?: string) {
  const totalResult = await introductionModel
    .aggregate([
      { $unwind: "$sentences" },
      { $unwind: "$sentences.feedback" },
      {
        $match: {
          ...(userId && { userId }),
          ...(search && {
            "sentences.text": { $regex: search, $options: "i" },
          }),
        },
      },
      {
        $count: "feedbackCount",
      },
    ])
    .exec();

  const total =
    totalResult.length > 0 ? (totalResult[0].feedbackCount as number) : 0;

  return total;
}

export const deleteFeedback = async (
  introductionId: string,
  sentenceId: string,
) => {
  try {
    const result = await introductionModel.updateOne(
      { _id: introductionId, "sentences._id": sentenceId },
      {
        $unset: { "sentences.$.feedback": "" },
      },
    );

    //@ts-ignore
    if (result?.nModified === 0) {
      console.log("No matching document found or feedback already absent.");
    } else {
      console.log("Feedback removed successfully.");
    }
  } catch (error) {
    console.error("Error removing feedback:", error);
  }
};
