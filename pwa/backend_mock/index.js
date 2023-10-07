import express from 'express';
const app = express();

app.get("/", (req, res) => {
    res.send("hello");
})

app.listen(5050, () => {
    console.log("mock backend running on port 5050");
})