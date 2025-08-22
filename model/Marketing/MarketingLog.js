import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadName: { type: String, required: true },
    leadDesignation: { type: String, required: true },
    leadContactNumber: { type: String, required: true },
  },
  { _id: true }
);

const marketingSchema = new mongoose.Schema(
  {
    User: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    date: { type: Date, required: true },
    intime: String,
    meetings: String,
    names: String,
    startKM: Number,
    officeOutTime: String,
    siteReachedTime: String,
    siteDetails: String,
    siteOutTime: String,
    officeReachedTime: String,
    endingKM: Number,
    verifyAuthority: String,
    leads: [leadSchema],
  },
  { timestamps: true }
);

export default mongoose.model("MarketingLog", marketingSchema);
