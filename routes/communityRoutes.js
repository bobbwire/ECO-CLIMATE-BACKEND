// routes/communityRoutes.js
import express from "express";
import {
  createGroup,
  getGroups,
  joinGroup,
  deleteGroup,
  createEvent,
  getEvents,
  rsvpEvent,
  deleteEvent,
  createProject,
  getProjects,
  contributeProject,
  deleteProject,
} from "../controllers/communityController.js";

const router = express.Router();

// ===== Groups =====
router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.post("/groups/:groupId/join", joinGroup);
router.delete("/groups/:groupId", deleteGroup); // soft delete group

// ===== Events =====
router.post("/events", createEvent);
router.get("/events", getEvents);
router.post("/events/:eventId/rsvp", rsvpEvent);
router.delete("/events/:eventId", deleteEvent); // soft delete event

// ===== Projects =====
router.post("/projects", createProject);
router.get("/projects", getProjects);
router.post("/projects/:projectId/contribute", contributeProject);
router.delete("/projects/:projectId", deleteProject); // soft delete project

export default router;
