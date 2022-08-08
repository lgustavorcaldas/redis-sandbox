const express = require("express");
const app = express();
const axios = require("axios");
const port = 8080;

const Redis = require("ioredis");
const redis = Redis.createClient();

const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const { albumId } = req.query;
    const photos = await getOrSetCache(`photos?albumId=${albumId}`, 
      async () => {
        const { data } = await axios.get( 
          "https://jsonplaceholder.typicode.com/photos",
          { params: { albumId } }
        );
        return data;
      }
    );
    res.json(photos);
  } catch (error) {
    console.error(error);
  }
});

function getOrSetCache (key, cb){
  return new Promise(
    (resolve, reject) => {
      redis.get(key, async (err, data) => {
        if (err) return reject(err);
        if (data != null ) {
          console.log("Redis Hit!");
          return resolve(JSON.parse(data));
        } 
        console.log("Redis Miss!");
        const newData = await cb();
        redis.setex(key, 60, JSON.stringify(newData));
        resolve(newData);
        }
      );
    }
  );
};

app.listen(port, console.log("App listening to port: " + port));