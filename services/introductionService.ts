import introductionModel, { IntroductionSchema } from "../models/introductions";
import { IntroductionDto, IntroductionDtoType, introductionsArrayDto } from "../validation/introduction";

/* 
Perfectly i would be working with repositories and i will setup a dependency injection container but we will keep simple for this project
*/
export const createIntroduction=async (introduction:IntroductionDtoType)=>{
    const res  = await introductionModel.create(introduction)

}

export const findIntroduction = async (id:string,userId:string):Promise<IntroductionDtoType>=>{
    const introduction = await  introductionModel.findOne({
        _id:id,
        userId
    })
    return await IntroductionDto.parseAsync(introduction)
}

export const findIntroductions = async (userId:string):Promise<IntroductionDtoType[]>=>{
    const introductions = await  introductionModel.find({
        userId
    });

    return await introductionsArrayDto.parseAsync(introductions);
}

export const deleteIntroduction = async (id:string,userId:string)=>{
    await introductionModel.deleteOne({
        _id:id,
        userId
    })
}

export const getIntroductionsStats = async (userId:string) => {
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
        const totalIntroductions = await introductionModel.countDocuments({ userId });
        console.log(`Total introductions ${totalIntroductions}`)

        // Total number of introductions grouped by moves
        const totalIntroductionsByMove = await introductionModel.aggregate([
            { $match: { userId } },
            { $unwind: "$sentences" },
            { $group: { _id: "$sentences.move", count: { $sum: 1 } } }
        ]);

        console.log(`Total introductions by move  ${totalIntroductionsByMove}`)

        // Average Confidence score
        const averageConfidenceScore = await introductionModel.aggregate([
            { $match: { userId } },
            { $unwind: "$sentences" },
            {
                $group: {
                    _id: null,
                    avgMoveConfidence: { $avg: "$sentences.moveConfidence" },
                    avgSubMoveConfidence: { $avg: "$sentences.subMoveConfidence" }
                }
            }
        ]);

        console.log(`Total introductions by move${totalIntroductionsByMove}`)
        // Average Confidence score grouped by moves
        const averageConfidenceScoreByMove = await introductionModel.aggregate([
            { $match: { userId } },
            { $unwind: "$sentences" },
            {
                $group: {
                    _id: "$sentences.move",
                    avgMoveConfidence: { $avg: "$sentences.moveConfidence" },
                    avgSubMoveConfidence: { $avg: "$sentences.subMoveConfidence" }
                }
            }
        ]);

        // Average Sentence position score
        const averageSentencePositionScore = await introductionModel.aggregate([
            { $match: { userId } },
            { $unwind: "$sentences" },
            { $group: { _id: null, avgOrder: { $avg: "$sentences.order" } } }
        ]);

        // Average Sentence position score grouped by moves
        const averageSentencePositionScoreByMove = await introductionModel.aggregate([
            { $match: { userId } },
            { $unwind: "$sentences" },
            { $group: { _id: "$sentences.move", avgOrder: { $avg: "$sentences.order" } } }
        ]);

        return {
            totalIntroductions,
            totalIntroductionsByMove,
            averageConfidenceScore: averageConfidenceScore[0],
            averageConfidenceScoreByMove,
            averageSentencePositionScore: averageSentencePositionScore[0],
            averageSentencePositionScoreByMove
        };
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw new Error("Could not fetch statistics.");
    }
};
