const express = require("express");
const router = express.Router();
const Course = require("../models/course");
const User = require("../models/User");

// Route to get courses based on user degree
router.get("/degree/:degree", async (req, res) => {
  try {
    const courses = await Course.find({ degree: req.params.degree });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to register for a course
router.post("/register", async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredCourses: courseId },
    });
    res.json({ message: "Course registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to unregister from a course
router.post("/unregister", async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredCourses: courseId },
    });
    res.json({ message: "Course unregistered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get registered courses for a user
router.get("/registered/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "registeredCourses"
    );
    res.json(user.registeredCourses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to search courses based on user degree and query
router.get("/search/:degree", async (req, res) => {
  const { query } = req.query;
  try {
    const courses = await Course.find({
      degree: req.params.degree,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { code: { $regex: query, $options: "i" } },
      ],
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
