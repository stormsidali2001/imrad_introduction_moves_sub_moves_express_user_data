import { PAGE_SIZE } from "../globals";
import introductionModel, {
  IntroductionDocument,
  IntroductionSchema,
} from "../models/introductions";
import {
  IntroductionDto,
  IntroductionDtoType,
  introductionsArrayDto,
} from "../validation/introduction";
import { IntroductionStatsDto } from "../validation/introductionStatsDto";
import { getPaginatedResults } from "../validation/paginatedDtoMaker";

/* 
Perfectly i would be working with repositories and i will setup a dependency injection container but we will keep it simple this time. 
*/

export const createIntroduction = async (introduction: IntroductionDtoType) => {
  const res = await introductionModel.create({
    ...introduction,
    averageMoveConfidence:
      introduction.sentences.reduce(
        (acc, sentence) => acc + sentence.moveConfidence,
        0,
      ) / introduction.sentences.length,
    averageSubMoveConfidence:
      introduction.sentences.reduce(
        (acc, sentence) => acc + sentence.subMoveConfidence,
        0,
      ) / introduction.sentences.length,
  });
};

export const findIntroduction = async (
  id: string,
  userId: string,
): Promise<IntroductionDtoType> => {
  const introduction = await introductionModel.findOne({
    _id: id,
    userId,
  });
  if (!introduction) {
    throw new Error("Introduction not found");
  }
  console.log("findIntroduction------------------");
  console.log(JSON.stringify(introduction));

  return await IntroductionDto.parseAsync(introduction);
};

export const findIntroductions = async (
  userId?: string,
  page: number = 1,
  search?: string,
) => {
  const introductions = await introductionModel
    .find(
      {
        ...(userId ? { userId } : {}),
        ...(search
          ? { "sentences.text": { $regex: search, $options: "i" } }
          : {}),
      },
      {
        sha: true,
        userId: true,
        sentences: {
          $slice: 1,
        },
        averageMoveConfidence: true,
        averageSubMoveConfidence: true,
      },
    )
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .sort({ order: 1 });

  console.log(JSON.stringify(introductions));
  const total = await introductionModel.countDocuments({
    userId,
    ...(search ? { "sentences.text": { $regex: search, $options: "i" } } : {}),
  });

  return getPaginatedResults(
    {
      data: introductions,
      page,
      per_page: PAGE_SIZE,
      total,
      total_pages: Math.ceil(total / PAGE_SIZE),
    },
    IntroductionDto,
  );
};

export const getTotalIntroductions = async (userId?: string) => {
  return introductionModel.countDocuments({
    ...(userId ? { userId } : {}),
  });
};

export const deleteIntroduction = async (id: string, userId: string) => {
  await introductionModel.deleteOne({
    _id: id,
    userId,
  });
};

export const getAverageConfidenceScore = async (userId?: string) => {
  try {
    const averageConfidenceScore = await introductionModel.aggregate([
      {
        $match: {
          ...(userId ? { userId } : {}),
        },
      },
      { $unwind: "$sentences" },
      {
        $group: {
          _id: null,
          avgMoveConfidence: { $avg: "$sentences.moveConfidence" },
          avgSubMoveConfidence: { $avg: "$sentences.subMoveConfidence" },
        },
      },
    ]);

    console.log("average confidence score", averageConfidenceScore);
    return {
      avgMoveConfidence:
        averageConfidenceScore?.[0]?.avgMoveConfidence ?? (0 as number),
      avgSubMoveConfidence:
        averageConfidenceScore?.[0]?.avgSubMoveConfidence ?? (0 as number),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export const getIntroductionsStats = async (userId?: string) => {
  /**
   * Returns the following statistics for a given user @param userId
   * Total number of introductions.
   * Total number of introductions grouped by moves
   *
   * Average Confidence score.
   * Average Confidence score grouped by moves
   *
   * Average Sentence position score.
   * Average Sentence position score grouped by moves
   */
  try {
    // Total number of introductions
    const totalIntroductions = await getTotalIntroductions(userId);

    console.log(`Total introductions ${totalIntroductions}`);

    // Total number of introductions grouped by moves
    const totalIntroductionsByMove = await introductionModel.aggregate([
      {
        $match: {
          ...(userId ? { userId } : {}),
        },
      },
      { $unwind: "$sentences" },
      { $group: { _id: "$sentences.move", count: { $sum: 1 } } },
    ]);

    console.log(`Total introductions by move  ${totalIntroductionsByMove}`);

    // Average Confidence score
    const averageConfidenceScore = await getAverageConfidenceScore(userId);

    console.log(`Total introductions by move${totalIntroductionsByMove}`);
    // Average Confidence score grouped by moves
    const averageConfidenceScoreByMove = await introductionModel.aggregate([
      {
        $match: {
          ...(userId ? { userId } : {}),
        },
      },
      { $unwind: "$sentences" },
      {
        $group: {
          _id: "$sentences.move",
          avgMoveConfidence: { $avg: "$sentences.moveConfidence" },
          avgSubMoveConfidence: { $avg: "$sentences.subMoveConfidence" },
        },
      },
    ]);

    // Average Sentence position score
    const averageSentencePositionScore = await introductionModel.aggregate([
      {
        $match: {
          ...(userId ? { userId } : {}),
        },
      },
      { $unwind: "$sentences" },
      { $group: { _id: null, avgOrder: { $avg: "$sentences.order" } } },
    ]);

    // Average Sentence position score grouped by moves
    const averageSentencePositionScoreByMove =
      await introductionModel.aggregate([
        {
          $match: {
            ...(userId ? { userId } : {}),
          },
        },
        { $unwind: "$sentences" },
        {
          $group: {
            _id: "$sentences.move",
            avgOrder: { $avg: "$sentences.order" },
          },
        },
      ]);

    return IntroductionStatsDto.parseAsync({
      totalIntroductions,
      totalIntroductionsByMove: totalIntroductionsByMove.map((item) => ({
        count: item.count,
        move: item._id,
      })),
      averageConfidenceScore: {
        avgMoveConfidence: averageConfidenceScore.avgMoveConfidence,
        avgSubMoveConfidence: averageConfidenceScore.avgSubMoveConfidence,
      },

      averageConfidenceScoreByMove: averageConfidenceScoreByMove.map(
        (item) => ({
          move: item._id,
          avgMoveConfidence: item.avgMoveConfidence,
          avgSubMoveConfidence: item.avgSubMoveConfidence,
        }),
      ),

      averageSentencePositionScore: {
        avgOrder: averageSentencePositionScore[0]?.avgOrder ?? 0,
      },
      averageSentencePositionScoreByMove:
        averageSentencePositionScoreByMove.map((item) => ({
          move: item._id,
          avgOrder: item.avgOrder,
        })),
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw new Error("Could not fetch statistics.");
  }
};
