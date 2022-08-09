const Redis = require("ioredis");
const redis = Redis.createClient();
const EXPIRATION_TIME = 60;

function getOrSetCache (key, cb){
  return new Promise( 
    ( resolve, reject ) => {
      redis.get(key, 
        async ( err, data ) => {
          if (err) return reject(err);
          if (data != null ) {
            console.log("Redis Hit!");
            return resolve(JSON.parse(data));
          } 
          console.log("Redis Miss!");
          const newData = await cb();
          redis.setex(key, EXPIRATION_TIME, JSON.stringify(newData));
          resolve(newData);
        }
      );
    }
  );
};

module.exports = getOrSetCache