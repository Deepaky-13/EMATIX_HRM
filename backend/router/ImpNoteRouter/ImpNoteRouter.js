import express from "express";
import {
  createImpNote,
  deleteImpNote,
  getAllImpNotes,
  getImpNoteById,
  updateImpNote,
} from "../../controller/ImpNote/ImpNoteController.js";

const router = express.Router();

router.route("/").get(getAllImpNotes).post(createImpNote);
router
  .route("/:id")
  .get(getImpNoteById)
  .patch(updateImpNote)
  .delete(deleteImpNote);

export default router;
