import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    tagname: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Tag", TagSchema);
