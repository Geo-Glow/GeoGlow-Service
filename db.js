require('dotenv').config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
if (!uri) {
    throw new Error("Mongo_URI is not defined in environment variables.");
}

const client = new MongoClient(uri);
let db;

async function connectToDatabase() {
    if (!db) {
        try {
            await client.connect();
            console.log("Connected to MongoDB");
            db = client.db("Vreunde");
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

async function getCollection(collectionName) {
    const db = await connectToDatabase();
    return db.collection(collectionName);
}

async function getAllFriends() {
    try {
        const friendsCollection = await getCollection("friends");
        return friendsCollection.find({}).toArray();
    } catch (err) {
        console.error("Error retrieving friends:", err);
        throw new Error("Failed to retrieve friends");
    }
}

async function getAllFriendsInGroup(groupId) {
    try {
        const friendsCollection = await getCollection("friends");
        return friendsCollection.find({ groupId: groupId }).toArray();
    } catch (err) {
        console.error(`Error retrieving friends in group: ${groupId}`, err);
        throw new Error("Failed to retrieve friendgroup");
    }
}

async function getFriend(friendId) {
    try {
        const friendsCollection = await getCollection("friends");
        const friend = await friendsCollection.findOne({ friendId: friendId });
        if (!friend) {
            throw new Error("Friend not found");
        } else return friend;
    } catch (err) {
        if (err.message === "Friend not found") {
            throw err;
        } else {
            console.error(`Error retrieving friend with friendId: ${friendId}`, err);
            throw new Error("Failed to retrieve friend");
        }
    }
}

async function postFriend(data) {
    try {
        const friendsCollection = await getCollection("friends");
        const { friendId, name, tileIds, groupId } = data;
        friendsCollection.insertOne(data);
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    connectToDatabase,
    closeConnection,
    getAllFriends,
    getAllFriendsInGroup,
    getFriend,
    postFriend
};