
import express,{Express , Request , Response} from 'express';
import introductionRouter from './routes/introductions/route';
import mongoose from 'mongoose';
import { env } from './envZod';
import { eurekaClient } from './eureka-client';
import bodyParser from 'body-parser';

eurekaClient.start()
mongoose.connect(env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

const app = express();

app.use(bodyParser({limit: '50mb'}));

app.get("/",(req:Request,res:Response)=>{
    res.send("Working")
})
// introductions
app.use("/introductions",introductionRouter);


app.listen(env.PORT,()=>{

    console.log(`Server is running on port ${env.PORT}`)
});