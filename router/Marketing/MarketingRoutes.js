// import express from "express";
// import {
//   createLog,
//   getLogs,
//   updateLog,
//   addLead,
//   updateLead,
//   deleteLead,
//   addClient,
//   updateClient,
//   deleteClient,
// } from "../../controller/Marketing/MarketingController.js";
// import authenticateUser from "../../middleware/AuthMiddleware/authMiddleware.js";

// const router = express.Router();

// // All routes require authentication
// router.use(authenticateUser);

// // Marketing Logs
// router.post("/", createLog); // Create a new log
// router.get("/", getLogs); // Get all logs
// router.put("/:id", updateLog); // Update a log

// // Leads inside a log
// router.post("/:id/leads", addLead); // Add a new lead
// router.put("/:id/leads/:leadId", updateLead); // Update a lead
// router.delete("/:id/leads/:leadId", deleteLead); // Delete a lead

// // Clients inside a log
// router.post("/:id/clients", addClient); // Add a new client
// router.put("/:id/clients/:clientId", updateClient); // Update a client
// router.delete("/:id/clients/:clientId", deleteClient); // Delete a client

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.post(
//   "/:id/:type/:itemId/upload-image",
//   upload.single("image"), // form-data field name = "image"
//   uploadMarketingImage
// );

// export default router;
import express from "express";
import multer from "multer";
import authenticateUser from "../../middleware/AuthMiddleware/authMiddleware.js";
import {
  createLog,
  getLogs,
  updateLog,
  addLead,
  updateLead,
  deleteLead,
  addClient,
  updateClient,
  deleteClient,
  uploadMarketingImage,
} from "../../controller/Marketing/MarketingController.js";

const router = express.Router();

// ✅ Require authentication for all routes
router.use(authenticateUser);

// ---------------- Logs ----------------
router.post("/", createLog);
router.get("/", getLogs);
router.put("/:id", updateLog);

// ---------------- Leads ----------------
router.post("/:id/leads", addLead);
router.put("/:id/leads/:leadId", updateLead);
router.delete("/:id/leads/:leadId", deleteLead);

// ---------------- Clients ----------------
router.post("/:id/clients", addClient);
router.put("/:id/clients/:clientId", updateClient);
router.delete("/:id/clients/:clientId", deleteClient);

// ---------------- Image Upload ----------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/:id/:type/:itemId/upload-image", // id=logId, type=lead|client, itemId=leadId|clientId
  upload.single("image"), // field name must be "image"
  uploadMarketingImage
);
//---------------------- Backup ----------------------

// router.get("/backup/by-date", backupMarketingImages);
// router.get("/backup/all", fullBackupMarketingImages);
// router.delete("/backup/delete/by-date", deleteMarketingImagesByDate);
// router.delete("/backup/delete/all", deleteAllMarketingImages);

export default router;
