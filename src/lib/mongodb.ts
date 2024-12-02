import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://mahadev:ka039814@cluster0.tiauwuh.mongodb.net/';
const client = new MongoClient(uri);
const dbName = 'alumni5thbatch';

export async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db(dbName);
    return { db, client };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function saveAlumni(alumniData: any) {
  const { db, client } = await connectToDatabase();
  try {
    const collection = db.collection('students');
    const result = await collection.insertOne(alumniData);
    return result;
  } finally {
    await client.close();
  }
}

export async function getAlumni() {
  const { db, client } = await connectToDatabase();
  try {
    const collection = db.collection('students');
    return await collection.find({}).toArray();
  } finally {
    await client.close();
  }
}

export async function checkNameExists(firstName: string, lastName: string) {
  const { db, client } = await connectToDatabase();
  try {
    const collection = db.collection('students');
    const existingAlumni = await collection.findOne({ firstName, lastName });
    return !!existingAlumni;
  } finally {
    await client.close();
  }
}