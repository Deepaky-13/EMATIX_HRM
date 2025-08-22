import { Router } from "express";
import {
  createDepartment,
  deleteDepartmentById,
  getAllDepartments,
  updateDepartmentById,
} from "../../controller/Department/DeparmentController.js";
const router = Router();

router.route("/").get(getAllDepartments).post(createDepartment);
router.route("/:id").patch(updateDepartmentById).delete(deleteDepartmentById);

export default router;
