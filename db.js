require('dotenv').config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
    if (!db) {
        try {
            await client.connect();
            console.log("Connected to MongoDB");
            db = client.db("GeoGlow_db");
        } catch (err) {
            console.error("Error connecting to MongoDB", err);
        }
    }
    return db;
}

async function closeConnection() {
    if (client) {
        try {
            await client.close();
            console.log("MongoDB connection closed");
        } catch (err) {
            console.error("Error closing MongoDB connection", err);
        }
    }
}

async function getAllFriends() {
    try {
        const db = await connectToDatabase();
        const friends_collection = db.collection("friends");
        return friends_collection.find({}).toArray();
    } catch (err) {
        console.error("Error finding friends", err);
        throw err;
    }
}

module.exports = {
    connectToDatabase,
    closeConnection,
    getAllFriends
};