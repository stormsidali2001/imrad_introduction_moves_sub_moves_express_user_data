import mongoose from 'mongoose'

export const FeedbackSchema = new mongoose.Schema({
    correctMove: { type: String, required: false },
    correctSubMove: { type: String, required: false },
    liked: { type: Boolean, required: true },
    //enum
    errorType:{ type: String, required: true, enum: ['SENTENCE_EXTRACTION','CLASSIFICATION'] },
})
const SentenceSchema = new mongoose.Schema({
    move: { type: String, required: true },
    subMove: { type: String, required: true },
    text: { type: String, required: true },
    order: { type: Number, required: true },
    moveConfidence: { type: Number, required: true },
    subMoveConfidence: { type: Number, required: true },
    feedbacks:{

        required:false,
        type:[FeedbackSchema]
    },
});

export const IntroductionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId:{
        type:String,
        required:true,

    },
    // an array of objects  { sentence: string, order:number ,move:number , subMove: number  }
    sentences: {
        type: [SentenceSchema],
        required: true
    },

});

 const introductionModel = mongoose.model('Introduction', IntroductionSchema); 
 export default introductionModel