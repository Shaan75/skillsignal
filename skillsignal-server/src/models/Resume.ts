import mongoose, { Document, Schema } from 'mongoose'

export interface IResume extends Document {
  user: mongoose.Types.ObjectId
  fileName: string
  fileUrl: string
  extractedText: string
  analysis: {
    score: number
    skills: string[]
    strengths: string[]
    improvements: string[]
    summary: string
  } | null
  createdAt: Date
}

const ResumeSchema = new Schema<IResume>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    analysis: {
      type: {
        score: Number,
        skills: [String],
        strengths: [String],
        improvements: [String],
        summary: String,
      },
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.model<IResume>('Resume', ResumeSchema)