import { Router } from "express";
import {
  createOrUpdateTaskStatus,
  getAllStatusUpdates,
  getStatusByTaskId,
} from "../../../controller/TaskModule/UserTask/TaskUpdateController.js";

const   router = Router();

router.route("/").get(getAllStatusUpdates).post(createOrUpdateTaskStatus);
router.route("/:id").get(getStatusByTaskId);

export default router;
