import { Router } from "express";
import {
  createProject,
  deleteProjectById,
  getAllProjects,
  updateProjectById,
} from "../../controller/ProjectAssign/ProjectController.js";

const router = Router();

router.route("/").get(getAllProjects).post(createProject);
router.route("/:id").patch(updateProjectById).delete(deleteProjectById);

export default router;
