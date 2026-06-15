import { Request, Response, NextFunction } from "express";
import { DocumentCategory, UserRole } from "@prisma/client";
import * as usersService from "./users.service";
import {
  updateProfileSchema,
  updateRoleSchema,
  updateActiveSchema,
  addDocumentSchema,
  listUsersQuerySchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "./users.schema";
import { HttpError } from "../../middlewares/errorHandler";

export async function getMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await usersService.getProfile(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function updateMeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProfileSchema.parse(req.body);
    res.json(await usersService.updateProfile(req.user!.id, data));
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatarHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) {
      throw new HttpError(400, "No avatar file provided");
    }
    res.json(await usersService.uploadAvatar(req.user!.id, file));
  } catch (err) {
    next(err);
  }
}

export async function listDocumentsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await usersService.listDocuments(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function addDocumentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;
    if (!file) {
      throw new HttpError(400, "No file provided");
    }
    const { category } = addDocumentSchema.parse(req.body);
    res.status(201).json(
      await usersService.addDocument(req.user!.id, file, category as DocumentCategory | undefined)
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteDocumentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await usersService.deleteDocument(req.user!.id, Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function listUsersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listUsersQuerySchema.parse(req.query);
    res.json(await usersService.listUsers({ role: query.role as UserRole | undefined }));
  } catch (err) {
    next(err);
  }
}

export async function updateUserRoleHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = updateRoleSchema.parse(req.body);
    res.json(await usersService.updateUserRole(Number(req.params.id), role as UserRole));
  } catch (err) {
    next(err);
  }
}

export async function updateUserActiveHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { isActive } = updateActiveSchema.parse(req.body);
    res.json(await usersService.updateUserActive(Number(req.params.id), isActive));
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    res.json(await usersService.changePassword(req.user!.id, currentPassword, newPassword));
  } catch (err) {
    next(err);
  }
}

export async function resetUserPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { newPassword } = resetPasswordSchema.parse(req.body);
    res.json(await usersService.resetUserPassword(Number(req.params.id), newPassword));
  } catch (err) {
    next(err);
  }
}
