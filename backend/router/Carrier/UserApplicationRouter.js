import express from "express";
import {
  createApplication,
  deleteApplication,
  getAllApplications,
  getApplicationById,
  getMyApplications,
  updateApplication,
} from "../../controller/Carrier/UserApplication.js";
import authenticateUser from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllApplications);
router.route("/").post(authenticateUser, createApplication);
router.route("/my").get(authenticateUser, getMyApplications);
router
  .route("/:id")
  .get(getApplicationById)
  .patch(updateApplication)
  .delete(deleteApplication);

export default router;
