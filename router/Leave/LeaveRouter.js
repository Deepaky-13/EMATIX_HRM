import express from "express";
import {
  createLeave,
  deleteLeave,
  getAllLeaves,
  getLeavesByUserId,
  updateLeave,
} from "../../controller/Leave/LeaveController.js";
import upload from "../../middleware/CloudinaryConfig/UploadMedia.js";
import authenticateUser from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllLeaves);

router.post("/", authenticateUser, upload.single("document"), createLeave);
router.route("/user/:userId").get(getLeavesByUserId);
router.route("/:id").patch(updateLeave).delete(deleteLeave);

export default router;
