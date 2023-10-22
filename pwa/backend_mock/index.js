import express from 'express';
// import mongoose from 'mongoose';
const app = express();

// mongoose.connect();

import nonce from './controllers';

app.get("/", (req, res) => {
    res.send("hello");
})

app.use('/api/nonce', nonce);

app.listen(5050, () => {
    console.log("mock backend running on port 5050");
})