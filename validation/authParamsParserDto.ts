import {z} from 'zod'

export const IntroductionParamsDto = z.object({
    userId:z.string(),
    id:z.string()


})