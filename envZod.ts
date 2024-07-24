
import dotenv from 'dotenv'

dotenv.config()


import {z} from 'zod'
 const EnvSchema = z.object({
  PORT: z.coerce.number().default(8011),
  MONGO_URI: z.string(),
}) 
export  const env = EnvSchema.parse(process.env)