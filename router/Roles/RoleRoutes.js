import { Router } from "express";
import {
  createRole,
  deleteRoleById,
  getAllRoles,
  getRoleById,
  toggleUserStatus,
  updatePassword,
  updateRoleById,
} from "../../controller/Roles/RoleController.js";
import { authenticateUser } from "../../middleware/AuthMiddleware/authMiddleware.js";

const router = Router();

router.route("/").get(getAllRoles).post(createRole);
router
  .route("/:id")
  .patch(updateRoleById)
  .delete(deleteRoleById)
  .get(getRoleById);
router.route("/toggle/:id").patch(toggleUserStatus);
router.route("/password/:id").patch(authenticateUser, updatePassword);
export default router;
