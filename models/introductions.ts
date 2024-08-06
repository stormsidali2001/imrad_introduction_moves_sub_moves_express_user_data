import mongoose from "mongoose";

export const FeedbackSchema = new mongoose.Schema({
  correctMove: { type: Number, required: false },
  correctSubMove: { type: Number, required: false },
  liked: { type: Boolean, required: true },
  //enum
  reason: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});
const SentenceSchema = new mongoose.Schema({
  move: { type: Number, required: true },
  subMove: { type: Number, required: true },
  text: { type: String, required: true },
  order: { type: Number, required: true },
  moveConfidence: { type: Number, required: true },
  subMoveConfidence: { type: Number, required: true },
  feedback: {
    required: false,
    type: FeedbackSchema,
  },
});

export const IntroductionSchema = new mongoose.Schema({
  sha: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  // an array of objects  { sentence: string, order:number ,move:number , subMove: number  }
  sentences: {
    type: [SentenceSchema],
    required: true,
  },
  averageSubMoveConfidence: {
    type: Number,
    required: true,
  },
  averageMoveConfidence: {
    type: Number,
    required: true,
  },
});

const introductionModel = mongoose.model("Introduction", IntroductionSchema);

export type IntroductionDocument = mongoose.Document &
  typeof introductionModel.schema;
export default introductionModel;
