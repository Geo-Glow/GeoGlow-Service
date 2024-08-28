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
            throw new Error("Failed to connect to MongoDB");
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
            throw new Error("Failed to close MongoDB connection");
        }
    }
}

async function getAllFriends() {
    try {
        const db = await connectToDatabase();
        const friendsCollection = db.collection("friends");
        return friendsCollection.find({}).toArray();
    } catch (err) {
        console.error("Error retrieving friends:", err);
        throw new Error("Failed to retrieve friends");
    }
}

async function getAllOnlineFriends() {
    try {
        const friends = await getAllFriends();
        if (!friends.length) {
            return [];
        }

        const db = await connectToDatabase();
        const deviceCollection = db.collection("devices");

        const friendIds = friends.map(friend => friend.friendId);
        const devices = await deviceCollection.find({ friendId: { $in: friendIds } }).toArray();

        const deviceFriendIds = devices.map(device => device.friendId);
        return friends.filter(friend => deviceFriendIds.includes(friend.friendId));
    } catch (err) {
        console.error("Error retrieving online friends:", err);
        throw new Error("Failed to retrieve online friends");
    }
}

async function getAllDevices() {
    try {
        const db = await connectToDatabase();
        const deviceCollection = db.collection('devices');
        return deviceCollection.find({}).toArray();
    } catch (err) {
        console.error("Error retrieving devices:", err);
        throw new Error("Failed to retrieve devices");
    }
}

module.exports = {
    connectToDatabase,
    closeConnection,
    getAllFriends,
    getAllOnlineFriends,
    getAllDevices
};