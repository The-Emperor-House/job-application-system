import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as jobsService from "./jobs.service";

const jobInputSchema = z.object({
  title: z.string().min(1),
  department: z.string().optional(),
  description: z.string().min(1),
  requirements: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]).optional(),
  salaryRange: z.string().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  closingDate: z.string().optional(),
});

export async function listOpenJobsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await jobsService.listOpenJobs());
  } catch (err) {
    next(err);
  }
}

export async function listAllJobsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await jobsService.listAllJobs());
  } catch (err) {
    next(err);
  }
}

export async function getJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await jobsService.getJobById(Number(req.params.id)));
  } catch (err) {
    next(err);
  }
}

export async function createJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = jobInputSchema.parse(req.body);
    res.status(201).json(await jobsService.createJob(data));
  } catch (err) {
    next(err);
  }
}

export async function updateJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = jobInputSchema.partial().parse(req.body);
    res.json(await jobsService.updateJob(Number(req.params.id), data));
  } catch (err) {
    next(err);
  }
}

export async function deleteJobHandler(req: Request, res: Response, next: NextFunction) {
  try {
    await jobsService.deleteJob(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
