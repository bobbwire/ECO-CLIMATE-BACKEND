import Education from "../models/Education.js";

// ✅ Get all resources
export const getResources = async (req, res) => {
  try {
    const resources = await Education.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resources", error: err.message });
  }
};

// ✅ Create new resource
export const createResource = async (req, res) => {
  try {
    const { title, type, duration, level, content, contentType } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content URL are required" });
    }

    const newResource = new Education({
      title,
      type,
      duration,
      level,
      content,
      contentType,
    });

    await newResource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(500).json({ message: "Error creating resource", error: err.message });
  }
};

// ✅ Get single resource by ID
export const getResourceById = async (req, res) => {
  try {
    const resource = await Education.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resource", error: err.message });
  }
};

// ✅ Delete resource
export const deleteResource = async (req, res) => {
  try {
    const resource = await Education.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting resource", error: err.message });
  }
};
