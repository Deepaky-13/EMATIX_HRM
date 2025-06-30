import { Router } from "express";
import {
  createSingleProject,
  deleteProjectById,
  getAllProjectList,
  updateSingleProjectById,
} from "../../controller/Project/ProjectListController.js";

const router = Router();

router.route("/").get(getAllProjectList).post(createSingleProject);
router.route("/:id").patch(updateSingleProjectById).delete(deleteProjectById);

export default router;
