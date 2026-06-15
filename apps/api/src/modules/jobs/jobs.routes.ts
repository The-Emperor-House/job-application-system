import { Router } from "express";
import {
  listOpenJobsHandler,
  listAllJobsHandler,
  getJobHandler,
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
} from "./jobs.controller";
import { authenticateToken, authorizeRole } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();
const requireStaff = [
  authenticateToken,
  authorizeRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR),
];

// Public
router.get("/", listOpenJobsHandler);
router.get("/:id", getJobHandler);

// Admin/HR
router.get("/admin/all", ...requireStaff, listAllJobsHandler);
router.post("/", ...requireStaff, createJobHandler);
router.patch("/:id", ...requireStaff, updateJobHandler);
router.delete("/:id", ...requireStaff, deleteJobHandler);

export default router;
