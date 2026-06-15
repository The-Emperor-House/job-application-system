import { Router } from "express";
import {
  createApplicationHandler,
  uploadAttachmentsHandler,
  listApplicationsHandler,
  getApplicationHandler,
  updateStatusHandler,
  addNoteHandler,
  listMyApplicationsHandler,
  getMyApplicationHandler,
} from "./applications.controller";
import { authenticateToken, authorizeRole } from "../../middlewares/auth";
import { uploadApplicationFiles } from "../../middlewares/upload";
import { UserRole } from "@prisma/client";

const router = Router();
const requireStaff = [
  authenticateToken,
  authorizeRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.HR),
];

// Authenticated applicant — submit an application and upload files
router.post("/", authenticateToken, createApplicationHandler);
router.post("/:id/attachments", authenticateToken, uploadApplicationFiles, uploadAttachmentsHandler);

// Authenticated applicant — view own application history
router.get("/my", authenticateToken, listMyApplicationsHandler);
router.get("/my/:id", authenticateToken, getMyApplicationHandler);

// Admin/HR/Super Admin — review applications
router.get("/", ...requireStaff, listApplicationsHandler);
router.get("/:id", ...requireStaff, getApplicationHandler);
router.patch("/:id/status", ...requireStaff, updateStatusHandler);
router.post("/:id/notes", ...requireStaff, addNoteHandler);

export default router;
