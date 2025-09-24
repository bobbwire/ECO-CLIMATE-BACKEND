import express from "express";
import {
  getJobs,
  createJob,
  getTrainings,
  createTraining,
  getInternships,
  createInternship,
  getProjects,
  createProject,
  donateToProject
} from "../controllers/jobsControllers.js";

const router = express.Router();

// Jobs
router.get("/jobs", getJobs);
router.post("/jobs", createJob);

// Trainings
router.get("/trainings", getTrainings);
router.post("/trainings", createTraining);

// Internships
router.get("/internships", getInternships);
router.post("/internships", createInternship);

// Projects (Funding)
router.get("/projects", getProjects);
router.post("/projects", createProject);
router.post("/projects/:id/donate", donateToProject);

export default router;
