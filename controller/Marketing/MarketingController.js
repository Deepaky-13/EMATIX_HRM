import MarketingLog from "../../model/Marketing/MarketingLog.js";
import cloudinary from "../../utils/Cloudinary.js";
import path from "path";
import { downloadAndZipImages } from "../../utils/ZipUtils.js";
// Create a new marketing log
export const createLog = async (req, res, next) => {
  try {
    const log = await MarketingLog.create({
      ...req.body,
      User: req.user.userId, // attach logged-in user
    });
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

/* ---------------- LEADS CRUD ---------------- */

// Add a new lead to a log
export const addLead = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $push: { leads: req.body } },
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
      { $set: { "leads.$": req.body } },
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

/* ---------------- CLIENTS CRUD ---------------- */

// Add a new client to a log
export const addClient = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $push: { clients: req.body } },
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Update a client inside a log
export const updateClient = async (req, res, next) => {
  try {
    const log = await MarketingLog.findOneAndUpdate(
      { _id: req.params.id, "clients._id": req.params.clientId },
      { $set: { "clients.$": req.body } },
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

// Delete a client from a log
export const deleteClient = async (req, res, next) => {
  try {
    const log = await MarketingLog.findByIdAndUpdate(
      req.params.id,
      { $pull: { clients: { _id: req.params.clientId } } },
      { new: true }
    ).populate("User", "name email role");
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const uploadMarketingImage = async (req, res) => {
  try {
    console.log(req.params);

    const { id, type, itemId } = req.params; // id = logId, itemId = leadId/clientId
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // convert buffer → base64
    const file64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;
    console.log(file64);

    const uploaded = await cloudinary.uploader.upload(file64, {
      folder: `marketing/${type}s`,
    });

    let updateQuery =
      type === "lead"
        ? { "leads.$.images": uploaded.secure_url }
        : { "clients.$.images": uploaded.secure_url };

    const updatedLog = await MarketingLog.findOneAndUpdate(
      { _id: id, [`${type}s._id`]: itemId },
      { $set: updateQuery },
      { new: true }
    );

    console.log("updatedLog:", updatedLog);

    if (!updatedLog) {
      return res.status(404).json({ message: `${type} not found` });
    }

    res.json({ message: "Image uploaded", data: updatedLog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
