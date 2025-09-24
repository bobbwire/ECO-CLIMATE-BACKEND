// middleware/communityDeleteMiddleware.js
const Group = require("../models/Group"); 
const Event = require("../models/Event");
const Project = require("../models/Project");

// ✅ Soft Delete Middleware for Community items
const checkCommunityDelete = (Model, type) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await Model.findById(id);

      if (!item) {
        return res.status(404).json({ success: false, message: `${type} not found` });
      }

      if (item.isDeleted) {
        return res.status(410).json({ success: false, message: `${type} has already been deleted` });
      }

      req.item = item; // attach to request
      next();
    } catch (error) {
      console.error(`❌ ${type} delete check error:`, error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
};

module.exports = {
  checkGroupDelete: checkCommunityDelete(Group, "Group"),
  checkEventDelete: checkCommunityDelete(Event, "Event"),
  checkProjectDelete: checkCommunityDelete(Project, "Project"),
};
