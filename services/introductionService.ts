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
