// console.log("server is running");

import express from "express";
const app = express();
import * as dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

import DepartmentRouter from "./router/Department/DepartmentRouter.js";
import RoleRouter from "./router/Roles/RoleRoutes.js";
import ProjectAssignRouter from "./router/ProjectsAssign/ProjectRouter.js";
import ProjectRouter from "./router/Project/ProjectListRouter.js";
import TaskAssignRouter from "./router/TaskModule/AdminTask/TaskAssignRouter.js";
import TaskUpdateRouter from "./router/TaskModule/userTask/TaskUpdateRouter.js";
import AttendanceRouter from "./router/Attendance/attendanceRouter.js";
import LeaveRouter from "./router/Leave/LeaveRouter.js";
import NoteRouter from "./router/ImpNoteRouter/ImpNoteRouter.js";
import CarrierRouter from "./router/Carrier/CarrierRouter.js";
import UserApplyRouter from "./router/Carrier/UserApplicationRouter.js";
import LoginRouter from "./router/Authentication/AuthRouter.js";

app.use(express.static(path.resolve(__dirname, "./public")));
app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/api/v1/department", DepartmentRouter);
app.use("/api/v1/role", RoleRouter);
app.use("/api/v1/projectAssign", ProjectAssignRouter);
app.use("/api/v1/project", ProjectRouter);
app.use("/api/v1/TaskAssign", TaskAssignRouter);
app.use("/api/v1/user/TaskUpdate", TaskUpdateRouter);
app.use("/api/v1/attendance", AttendanceRouter);
app.use("/api/v1/leave", LeaveRouter);
app.use("/api/v1/note", NoteRouter);
app.use("/api/v1/carrier", CarrierRouter);
app.use("/api/v1/userApply", UserApplyRouter);
app.use("/api/v1/auth/login", LoginRouter);

app.get("/*splat", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
