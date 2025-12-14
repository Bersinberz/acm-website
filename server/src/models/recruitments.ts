import mongoose, { Document, Schema } from "mongoose";

export interface IRecruitment extends Document {
  title: string;
  role: string;
  description: string;
  startDate: Date;
  endDate: Date;
  isOpen: boolean;
  applicantsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecruitmentSchema = new Schema<IRecruitment>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRecruitment>(
  "Recruitment",
  RecruitmentSchema
);
