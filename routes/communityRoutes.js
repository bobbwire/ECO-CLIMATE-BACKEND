const express = require("express");
const {
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
} = require("../controllers/communityController");

const router = express.Router();

// ===== Groups =====
router.post("/groups", createGroup);
router.get("/groups", getGroups);
router.post("/groups/:groupId/join", joinGroup);
router.delete("/groups/:groupId", deleteGroup); // Soft delete group

// ===== Events =====
router.post("/events", createEvent);
router.get("/events", getEvents);
router.post("/events/:eventId/rsvp", rsvpEvent);
router.delete("/events/:eventId", deleteEvent); // Soft delete event

// ===== Projects =====
router.post("/projects", createProject);
router.get("/projects", getProjects);
router.post("/projects/:projectId/contribute", contributeProject);
router.delete("/projects/:projectId", deleteProject); // Soft delete project

module.exports = router;
