const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3500;
const MONGO_URI = "mongodb://127.0.0.1:27017/FirstDB";

app.disable('etag');
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
  });


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {});
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Define Student Schema
const studentSchema = new mongoose.Schema({
  StudentID: { type: Number, required: true, unique: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Age: { type: Number, required: true },
  Grade: { type: Number, required: true },
  Email: { type: String, required: true },
  EnrolledDate: { type: Date, required: true },
});

// Define Student Model
const student = mongoose.model("student", studentSchema, "student");

// REST API Endpoints

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await student.find();
    console.log("Data fetched from MongoDB:", students); // Log retrieved data
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching students", error: err });
  }
});

// Get a single student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student", error: err });
  }
});

// Create a new student
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ message: "Error creating student", error: err });
  }
});

// Update a student by ID
app.put("/api/students/:id", async (req, res) => {
  try {
    const updatedStudent = await student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: "Error updating student", error: err });
  }
});

// Delete a student by ID
app.delete("/api/students/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
