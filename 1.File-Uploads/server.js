require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const connect = require("./ConnectDB/dbConnect");
const Image = require("./DesignSchemaModel/ImageSchema");
const app = express();

const PORT = 5000;

// Configure cloudinary
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images-folder",
    format: async (req, file) => "png",
    public_id: (req, file) => file.fieldname + "_" + Date.now(),
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "fill",
      },
    ],
  },
});

// Configure multer
const upload = multer({
  storage,
  limits: 1024 * 1024 * 5, //5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image", false));
    }
  },
});

// Upload route
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const uploaded = await Image.create({
    url: req.file.path,
    public_id: req.file.filename,
  });
  res.json({
    message: "File upload",
    uploaded
  });
});

// get all images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json({ images });
  } catch (error) {
    res.json(error)
  }
});

//! Start the server
app.listen(PORT, console.log(`Server running on port ${PORT}..`));
