import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/TaskController.js";

const router = Router();

// All task routes require a valid login token.
router.use(requireAuth);

// Validate task IDs before running the controller.
router.param("id", (_req, res, next, id: string) => {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID.",
    });
    return;
  }

  next();
});

router.route("/").post(createTask).get(getTasks);

router
  .route("/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

export default router;