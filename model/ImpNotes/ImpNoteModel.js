import mongoose from "mongoose";

const noteschema = new mongoose.Schema(
  {
    agenda: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteschema);
