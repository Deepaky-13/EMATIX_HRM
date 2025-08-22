import MarketingLog from "../../model/Marketing/MarketingLog.js";

// Create a new marketing log
export const createLog = async (req, res, next) => {
  try {
    const log = await MarketingLog.create({
      ...req.body,

      User: req.user.userId, // attach logged-in user
    });
    console.log("log", req.user.userId);

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// Get all marketing logs (populated with user info)
export const getLogs = async (req, res, next) => {
  try {
    const logs = await MarketingLog.find().populate("User", "name email role");
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// Update a marketing log
export const updateLog = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body, User: req.user._id } }, // track who updated
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Add a new lead to a log
export const addLead = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $push: { leads: { ...req.body, User: req.user._id } } }, // track who added the lead
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Update a lead inside a log
export const updateLead = async (req, res, next) => {
  try {
    const log = await MarketingLog.findOneAndUpdate(
      { _id: req.params.id, "leads._id": req.params.leadId },
      { $set: { "leads.$": { ...req.body, User: req.user._id } } }, // track who updated the lead
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Delete a lead from a log
export const deleteLead = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $pull: { leads: { _id: req.params.leadId } } },
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};
