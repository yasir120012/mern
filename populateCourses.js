const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require("path"); // Import path module
const Course = require(path.join(__dirname, "server", "models", "course")); // Correct path to your Course model
const courses = require("./data/courses"); // Adjust path if necessary
console.log(Course); // Add this line to check if Course is correctly defined

const uri = "mongodb://127.0.0.1:27017"; // Replace with your MongoDB URI if different
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const databaseName = "mern-app"; // Replace with your database name
const collectionName = "courses"; // Replace with your collection name

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    // Flatten the courses object into an array
    const allCourses = Object.values(courses).flat();

    console.log("Inserting Courses:", allCourses);

    // Insert documents into the collection
    const result = await collection.insertMany(allCourses);
    console.log(`${result.insertedCount} courses inserted`);
  } catch (err) {
    console.error("Error populating courses:", err);
  } finally {
    await client.close();
  }
}

run();
