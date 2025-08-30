import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadName: { type: String, required: true },
    leadDesignation: { type: String, required: true },
    leadContactNumber: { type: String, required: true },
    images: String,
  },
  { _id: true }
);

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientRemarks: { type: String, required: true },
    clientContactNumber: { type: String, required: true },
    images: String,
  },
  { _id: true }
);

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
    capturedAt: { type: Date, default: Date.now },
  },
  { _id: false }
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
    officeOutLocation: locationSchema, // 📍 location capture
    siteReachedTime: String,
    siteReachedLocation: locationSchema,
    siteDetails: String,
    siteOutTime: String,
    siteOutLocation: locationSchema,
    officeReachedTime: String,
    officeReachedLocation: locationSchema,
    endingKM: Number,
    verifyAuthority: String,
    leads: [leadSchema],
    clients: [clientSchema],
  },
  { timestamps: true }
);

export default mongoose.model("MarketingLog", marketingSchema);
