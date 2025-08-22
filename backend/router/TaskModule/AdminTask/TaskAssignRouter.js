import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTasksByEmployee,
  updateTask,
} from "../../../controller/TaskModule/AdminTask/TaskAssignController.js";

const router = Router();

router.route("/").get(getAllTasks).post(createTask);
router
  .route("/:id")
  .patch(updateTask)
  .delete(deleteTask)
  .get(getTasksByEmployee);

export default router;
