import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME;

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

app.post("/api/alumni", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(process.env.COLLECTION_NAME);
    const result = await collection.insertOne(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/alumni", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(process.env.COLLECTION_NAME);
    const alumni = await collection.find({}).toArray();
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/check-name", async (req, res) => {
  try {
    const { firstName, lastName } = req.query;
    const db = client.db(dbName);
    const collection = db.collection(process.env.COLLECTION_NAME);
    const existingAlumni = await collection.findOne({ firstName, lastName });
    res.json({ exists: !!existingAlumni });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
