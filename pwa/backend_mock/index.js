import express from 'express';
import mongoose from 'mongoose';
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/pwa');

import router from './controllers/index.js';

app.get("/", (req, res) => {
    res.send("hello");
})

app.use('/api', router);

app.listen(5050, () => {
    console.log("mock backend running on port 5050");
})