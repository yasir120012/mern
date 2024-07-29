const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const path = require("path"); // Import path module
const Course = require(path.join(__dirname, "server", "models", "course")); 
const courses = require("./data/courses"); 
console.log(Course); 

const uri = "mongodb://127.0.0.1:27017"; 
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const databaseName = "mern-app"; 
const collectionName = "courses"; 

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
