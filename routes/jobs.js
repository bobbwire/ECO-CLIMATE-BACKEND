// routes/jobsRoutes.js
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
  donateToProject,
} from "../controllers/jobsControllers.js";

const router = express.Router();

// ===== Jobs =====
/**
 * @route   GET /api/jobs/jobs
 * @desc    Fetch all job postings
 * @access  Public
 */
router.get("/jobs", getJobs);

/**
 * @route   POST /api/jobs/jobs
 * @desc    Create a new job posting
 * @access  Public (should be protected for admins in future)
 */
router.post("/jobs", createJob);

// ===== Trainings =====
/**
 * @route   GET /api/jobs/trainings
 * @desc    Fetch all training programs
 * @access  Public
 */
router.get("/trainings", getTrainings);

/**
 * @route   POST /api/jobs/trainings
 * @desc    Create a new training program
 * @access  Public (should be protected for admins in future)
 */
router.post("/trainings", createTraining);

// ===== Internships =====
/**
 * @route   GET /api/jobs/internships
 * @desc    Fetch all internships
 * @access  Public
 */
router.get("/internships", getInternships);

/**
 * @route   POST /api/jobs/internships
 * @desc    Create a new internship
 * @access  Public (should be protected for admins in future)
 */
router.post("/internships", createInternship);

// ===== Projects (Funding) =====
/**
 * @route   GET /api/jobs/projects
 * @desc    Fetch all projects available for funding
 * @access  Public
 */
router.get("/projects", getProjects);

/**
 * @route   POST /api/jobs/projects
 * @desc    Create a new project for funding
 * @access  Public (should be protected for admins in future)
 */
router.post("/projects", createProject);

/**
 * @route   POST /api/jobs/projects/:id/donate
 * @desc    Donate to a specific project
 * @access  Public
 */
router.post("/projects/:id/donate", donateToProject);

export default router;
