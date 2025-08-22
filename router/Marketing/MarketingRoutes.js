import express from "express";
import {
  createLog,
  getLogs,
  updateLog,
  addLead,
  updateLead,
  deleteLead,
} from "../../controller/Marketing/MarketingController.js";
import authenticateUser from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

// Marketing Logs
router.post("/", authenticateUser, createLog); // Create a new log
router.get("/", getLogs); // Get all logs
router.put("/:id", updateLog); // Update a log

// Leads inside a log
router.post("/:id/leads", addLead); // Add a new lead
router.put("/:id/leads/:leadId", updateLead); // Update a lead
router.delete("/:id/leads/:leadId", deleteLead); // Delete a lead

export default router;
