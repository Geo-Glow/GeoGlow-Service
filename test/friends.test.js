const request = require('supertest');
const { MongoClient } = require('mongodb');
const { expect } = require('chai');
const app = require('../app');
require('dotenv').config();

// Use the same MongoClient URI used in the db.js
const uri = process.env.MONGO_URI;

describe('Friends Routes', () => {
    let client;
    let db;

    before(async () => {
        // Initialize MongoDB Client
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('Vreunde');

        // Clear the friends collection and insert dummy data before each test
        await db.collection('friends').deleteMany({});
        await db.collection('friends').insertMany([
            { friendId: '1', name: 'Alice', groupId: 'a' },
            { friendId: '2', name: 'Bob', groupId: 'b' },
            { friendId: '3', name: 'Charlie', groupId: 'a' },
            { friendId: '4', name: 'Dave', groupId: 'b' },
            { friendId: '5', name: 'Eve', groupId: 'c' },
        ]);
    });

    after(async () => {
        // Clean up and close the connection after all tests run
        await client.close();
    });

    it('should GET all friends', async () => {
        const res = await request(app).get('/friends');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(5);
    });

    it('should GET all friends in a specific group', async () => {
        const res = await request(app).get('/friends?groupId=a');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        expect(res.body[0]).to.have.property('groupId', 'a');
    });

    it('should GET a specific friend by friendId', async () => {
        const res = await request(app).get('/friends/1');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name', 'Alice');
    });

    it('should return 404 for a non-existent friend', async () => {
        const res = await request(app).get('/friends/999');
        expect(res.status).to.equal(404);
    });
});