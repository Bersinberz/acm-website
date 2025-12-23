import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  Firstname: string;
  Lastname: string;
  Email: string;
  Mobile: string;
  Message: string;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    Firstname: {
      type: String,
      required: true,
      trim: true,
    },
    Lastname: {
      type: String,
      required: true,
      trim: true,
    },
    Email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    Mobile: {
      type: String,
      required: true,
      trim: true,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
