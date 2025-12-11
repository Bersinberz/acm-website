import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    profilePic: { type: String, default: "" },

    social: {
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    collection: "members",
  }
);

export default mongoose.model("Member", MemberSchema);