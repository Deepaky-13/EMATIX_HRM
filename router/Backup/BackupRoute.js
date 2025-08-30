// Routes/marketingRoutes.js
import express from "express";
import {
  backupMarketingImages,
  fullBackupMarketingImages,
  deleteMarketingImagesByDate,
  deleteAllMarketingImages,
} from "../../utils/BacupImagesByDate.js";

const router = express.Router();

// 📦 Backup (date range)
router.get("/backup", backupMarketingImages);

// 📦 Backup all
router.get("/all", fullBackupMarketingImages);

// ❌ Delete (date range)
router.delete("/delete", deleteMarketingImagesByDate);

// ❌ Delete all
router.delete("/delete/all", deleteAllMarketingImages);

export default router;
