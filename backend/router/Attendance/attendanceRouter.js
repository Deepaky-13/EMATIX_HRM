import express from "express";
import {
  toggleAttendance,
  getTodayAttendance,
  getAllAttendance,
  getAllAttendanceForLoggedInUser,
  getAllAttendanceForAdmin,
} from "../../controller/Attendance/attendanceController.js";
import authMiddleware from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", authMiddleware, toggleAttendance);
router.get("/today", authMiddleware, getTodayAttendance);
router.get("/", authMiddleware, getAllAttendance);
router.get("/user", authMiddleware, getAllAttendanceForLoggedInUser);
// router.get("/monthly", authMiddleware, getMonthlyAttendance);
router.get("/admin", authMiddleware, getAllAttendanceForAdmin);

export default router;
