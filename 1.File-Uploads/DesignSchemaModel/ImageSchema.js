const mongoose = require("mongoose")
// Image schema
const imageSchema = new mongoose.Schema({
    url: String,
    public_id: String,
})

// Model
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;