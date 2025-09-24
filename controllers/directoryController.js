import Directory from "../models/Directory.js";

// ✅ Get all listings
export const getListings = async (req, res) => {
  try {
    const listings = await Directory.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error("❌ Error fetching listings:", err);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
};

// ✅ Create a new listing
export const createListing = async (req, res) => {
  try {
    const { name, description, category, address, phone, email } = req.body;

    // Store uploaded file path if file is uploaded
    let media = "";
    if (req.file) {
      media = `/uploads/${req.file.filename}`;
    }

    const listing = new Directory({
      name,
      description,
      category,
      address,
      phone,
      email,
      media,
    });

    const saved = await listing.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating listing:", err);
    res.status(400).json({
      message: "Failed to create listing",
      error: err.message,
    });
  }
};
