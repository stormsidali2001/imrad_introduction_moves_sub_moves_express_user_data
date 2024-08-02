import express,{Response,Request} from 'express';
import { IntroductionDto } from '../../validation/introduction';
import { createIntroduction, findIntroductions, getIntroductionsStats } from '../../services/introductionService';
import { RetrieverParamsDto } from '../../validation/RetrieverParamsDto';

const introductionRouter = express.Router();

introductionRouter.get("/users/:userId",async (req:Request,res:Response)=>{
    try{
        console.log(req.params,req.query)
        
    const {page,search,userId} = await RetrieverParamsDto.parseAsync({...req.params,...req.query});

    const introductions = await findIntroductions(userId,page,search);
    res.status(200).json(introductions)

    }catch(err){
        console.error(JSON.stringify(err))
        res.status(422).json(err)
    }

});

introductionRouter.post("/",async (req:Request,res:Response)=>{
    console.log("body",req.body)
    const introduction = await IntroductionDto.parseAsync(req.body);
    console.log(introduction);
    await createIntroduction(introduction)


    res.status(201).json([])
});

introductionRouter.get("/stats/users/:userId",async (req:Request,res:Response)=>{
    
   const stats =   await getIntroductionsStats(req.params.userId);
   res.status(200).json(stats)

})

export default introductionRouter;