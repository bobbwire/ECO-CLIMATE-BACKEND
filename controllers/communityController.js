const { Group, Event, Project } = require("../models/Community");
const { sendNotificationEmail } = require("../utils/emailUtils");

// Utility: get organizer email from req.user (JWT) or req.body (fallback)
const getRequesterEmail = (req) => {
  if (req.user?.email) return req.user.email;
  if (req.body?.organizerEmail) return req.body.organizerEmail;
  return null;
};

// ===== GROUPS =====
exports.createGroup = async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json({ message: "✅ Group created successfully", group });
  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
    res.status(200).json(groups);
  } catch (error) {
    console.error("❌ Error fetching groups:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group || group.status === "deleted") {
      return res.status(404).json({ message: "❌ Group not found" });
    }

    group.members.push({
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      joinedAt: new Date(),
    });

    await group.save();

    try {
      await sendNotificationEmail(
        "joined your group",
        req.body.name,
        req.body.email,
        group.organizerEmail,
        group.name
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (group join):", emailError.message);
    }

    res.status(200).json({ message: "✅ Joined group successfully", group });
  } catch (error) {
    console.error("❌ Error in joinGroup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SOFT DELETE GROUP
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "❌ Group not found" });

    const requesterEmail = getRequesterEmail(req);
    if (!requesterEmail || group.organizerEmail !== requesterEmail) {
      return res.status(403).json({ message: "🚫 Only the organizer can delete this group" });
    }

    group.status = "deleted";
    await group.save();

    res.json({ message: "🗑️ Group soft-deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting group:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== EVENTS =====
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "✅ Event created successfully", event });
  } catch (error) {
    console.error("❌ Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: { $ne: "deleted" } }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event || event.status === "deleted") {
      return res.status(404).json({ message: "❌ Event not found" });
    }

    event.rsvps.push({
      name: req.body.name,
      email: req.body.email,
      guests: req.body.guests,
      rsvpAt: new Date(),
    });

    await event.save();

    try {
      await sendNotificationEmail(
        "RSVP'd to your event",
        req.body.name,
        req.body.email,
        event.organizerEmail,
        event.title
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (event RSVP):", emailError.message);
    }

    res.status(200).json({ message: "✅ RSVP successful", event });
  } catch (error) {
    console.error("❌ Error in rsvpEvent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SOFT DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "❌ Event not found" });

    const requesterEmail = getRequesterEmail(req);
    if (!requesterEmail || event.organizerEmail !== requesterEmail) {
      return res.status(403).json({ message: "🚫 Only the organizer can delete this event" });
    }

    event.status = "deleted";
    await event.save();

    res.json({ message: "🗑️ Event soft-deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===== PROJECTS =====
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ message: "✅ Project created successfully", project });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: { $ne: "deleted" } }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.contributeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || project.status === "deleted") {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    project.volunteers.push({
      name: req.body.name,
      email: req.body.email,
      contribution: req.body.contribution,
      volunteeredAt: new Date(),
    });

    await project.save();

    try {
      await sendNotificationEmail(
        "volunteered for your project",
        req.body.name,
        req.body.email,
        project.organizerEmail,
        project.title
      );
    } catch (emailError) {
      console.error("⚠️ Email failed (project contribution):", emailError.message);
    }

    res.status(200).json({ message: "✅ Contribution successful", project });
  } catch (error) {
    console.error("❌ Error in contributeProject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SOFT DELETE PROJECT
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "❌ Project not found" });

    const requesterEmail = getRequesterEmail(req);
    if (!requesterEmail || project.organizerEmail !== requesterEmail) {
      return res.status(403).json({ message: "🚫 Only the organizer can delete this project" });
    }

    project.status = "deleted";
    await project.save();

    res.json({ message: "🗑️ Project soft-deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
