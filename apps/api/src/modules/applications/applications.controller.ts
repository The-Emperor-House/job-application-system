import { Request, Response, NextFunction } from "express";
import * as applicationsService from "./applications.service";
import {
  createApplicationSchema,
  updateApplicationSchema,
  updateStatusSchema,
  addNoteSchema,
  listApplicationsQuerySchema,
} from "./applications.schema";

export async function createApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createApplicationSchema.parse(req.body);
    res.status(201).json(await applicationsService.createApplication(data, req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function uploadAttachmentsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as { resume?: Express.Multer.File[]; photo?: Express.Multer.File[] } | undefined;
    const result = await applicationsService.uploadAttachments(
      Number(req.params.id),
      files ?? {},
      req.user!.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function listMyApplicationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await applicationsService.listMyApplications(req.user!.id));
  } catch (err) {
    next(err);
  }
}

export async function getMyApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await applicationsService.getMyApplicationById(req.user!.id, Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function updateMyApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateApplicationSchema.parse(req.body);
    res.json(await applicationsService.updateApplication(Number(req.params.id), req.user!.id, data));
  } catch (err) {
    next(err);
  }
}

export async function deleteMyAttachmentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await applicationsService.deleteMyAttachment(Number(req.params.id), req.user!.id, Number(req.params.attachmentId));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function deleteMyPhotoHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await applicationsService.deleteMyPhoto(Number(req.params.id), req.user!.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listApplicationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listApplicationsQuerySchema.parse(req.query);
    res.json(await applicationsService.listApplications(query));
  } catch (err) {
    next(err);
  }
}

export async function getApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await applicationsService.getApplicationById(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function updateStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = updateStatusSchema.parse(req.body);
    res.json(await applicationsService.updateApplicationStatus(Number(req.params.id), status));
  } catch (err) {
    next(err);
  }
}

export async function deleteApplicationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await applicationsService.deleteApplication(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function addNoteHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { note } = addNoteSchema.parse(req.body);
    res.status(201).json(
      await applicationsService.addApplicationNote(Number(req.params.id), req.user!.id, note)
    );
  } catch (err) {
    next(err);
  }
}
