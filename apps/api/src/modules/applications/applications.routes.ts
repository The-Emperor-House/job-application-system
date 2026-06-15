import { Router } from "express";
import {
  createApplicationHandler,
  uploadAttachmentsHandler,
  listApplicationsHandler,
  getApplicationHandler,
  updateStatusHandler,
  deleteApplicationHandler,
  addNoteHandler,
  listMyApplicationsHandler,
  getMyApplicationHandler,
  updateMyApplicationHandler,
  deleteMyAttachmentHandler,
  deleteMyPhotoHandler,
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
router.patch("/my/:id", authenticateToken, updateMyApplicationHandler);
router.delete("/my/:id/attachments/:attachmentId", authenticateToken, deleteMyAttachmentHandler);
router.delete("/my/:id/photo", authenticateToken, deleteMyPhotoHandler);

// Admin/HR/Super Admin — review applications
router.get("/", ...requireStaff, listApplicationsHandler);
router.get("/:id", ...requireStaff, getApplicationHandler);
router.patch("/:id/status", ...requireStaff, updateStatusHandler);
router.delete("/:id", ...requireStaff, deleteApplicationHandler);
router.post("/:id/notes", ...requireStaff, addNoteHandler);

export default router;
