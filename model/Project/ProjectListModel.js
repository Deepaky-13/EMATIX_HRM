import mongoose from "mongoose";

const projectListSchema = mongoose.Schema({
  project_name: {
    type: String,
    required: true,
    trim: true,
  },
});

export default mongoose.model("projectList", projectListSchema);
