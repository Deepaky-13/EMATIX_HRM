import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logOutUser,
} from "../../controller/Authentication/authController.js";
import { authenticateUser } from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = Router();

router.route("/").post(loginUser);
router.route("/logout").get(logOutUser);
router.route("/user").get(authenticateUser, getCurrentUser);
export default router;
