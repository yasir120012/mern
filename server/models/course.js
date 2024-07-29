// server/models/course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
  },
  { collection: "courses" }
); // Explicitly specify the collection name

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
