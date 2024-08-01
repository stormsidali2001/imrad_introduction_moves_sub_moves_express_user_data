import express,{Response,Request} from 'express';
import { IntroductionDto } from '../../validation/introduction';
import { createIntroduction, getIntroductionsStats } from '../../services/introductionService';

const introductionRouter = express.Router();

introductionRouter.get("/",(req:Request,res:Response)=>{

    res.send("introductions")
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