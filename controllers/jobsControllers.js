import { Job, Training, Internship, Project } from "../models/Jobs.js";

// ================= JOBS =================
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" }).sort({ posted: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= TRAININGS =================
export const getTrainings = async (req, res) => {
  try {
    const trainings = await Training.find({ status: "active" }).sort({ posted: -1 });
    res.json(trainings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTraining = async (req, res) => {
  try {
    const training = new Training(req.body);
    await training.save();
    res.status(201).json(training);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= INTERNSHIPS =================
export const getInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ status: "active" }).sort({ posted: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createInternship = async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= PROJECTS (Funding) =================
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "active" }).sort({ created: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Donations
export const donateToProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { amount, donorEmail } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    project.raised += amount;
    project.donors += 1;
    project.donations.push({ amount, donorEmail });

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
