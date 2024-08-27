const express = require('express');
const app = express();
const port = 3000;

const { connectToDatabase, closeConnection, getAllFriends } = require('./db');

connectToDatabase().catch(console.error);

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/friends', async (req, res) => {
    try {
        const data = await getAllFriends();
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});