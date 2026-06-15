import { Router } from "express";
import { UserRole } from "@prisma/client";
import {
  getMeHandler,
  updateMeHandler,
  uploadAvatarHandler,
  listDocumentsHandler,
  addDocumentHandler,
  deleteDocumentHandler,
  listUserDocumentsHandler,
  listUsersHandler,
  updateUserRoleHandler,
  updateUserActiveHandler,
  changePasswordHandler,
  resetUserPasswordHandler,
} from "./users.controller";
import { authenticateToken, authorizeRole } from "../../middlewares/auth";
import { uploadAvatar, uploadDocument } from "../../middlewares/upload";

const router = Router();
const requireSuperAdmin = [authenticateToken, authorizeRole(UserRole.SUPER_ADMIN)];

router.get("/me", authenticateToken, getMeHandler);
router.patch("/me", authenticateToken, updateMeHandler);
router.post("/me/avatar", authenticateToken, uploadAvatar, uploadAvatarHandler);

router.patch("/me/password", authenticateToken, changePasswordHandler);

router.get("/me/documents", authenticateToken, listDocumentsHandler);
router.post("/me/documents", authenticateToken, uploadDocument, addDocumentHandler);
router.delete("/me/documents/:id", authenticateToken, deleteDocumentHandler);

router.get("/", ...requireSuperAdmin, listUsersHandler);
router.get("/:id/documents", ...requireSuperAdmin, listUserDocumentsHandler);
router.patch("/:id/role", ...requireSuperAdmin, updateUserRoleHandler);
router.patch("/:id/active", ...requireSuperAdmin, updateUserActiveHandler);
router.patch("/:id/reset-password", ...requireSuperAdmin, resetUserPasswordHandler);

export default router;
