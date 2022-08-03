const express = require("express");
const app = express();
const axios = require("axios");
const port = 8080;

const Redis = require("ioredis");
const redisClient = Redis.createClient();

const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
    const albumId = req.query.albumId;
    const photos = await getOrSetCache( `photos?albumId=${albumId}`, async () => {
        const { data } = await axios.get( 
            "https://jsonplaceholder.typicode.com/photos", { params: { albumId } }
        );
        return data;
    });
    res.json(photos);
});

function getOrSetCache (key, cb){
    return new Promise((resolve, reject) => {
        redisClient.get(key, async (error, data) => {
            if (error) return reject(error);
            if (data != null ){
                console.log("Redis Hit!");
                return resolve(JSON.parse(data));
            } 
            console.log("Redis Miss!");
            const freshData = await cb();
            redisClient.setex(key, 60, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
};

app.listen(port, console.log("App listening to port: " + port));