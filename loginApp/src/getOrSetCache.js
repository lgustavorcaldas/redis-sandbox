const Redis = require("ioredis");
const redis = Redis.createClient();
const EXPIRATION_TIME = 60;

module.exports = {
  getOrSetCache: function (key, callBack) {
    return new Promise( (resolve, reject) => {
      redis.get( key, async (error, data) => {
        if( error ) return reject(error) && console.error(error);
        if( data != null ) {
          console.log("Redis Hit!");
          return resolve(JSON.parse(data));
        };
  
        console.log("Redis Miss!");
        const newData = await callBack();
        redis.setex( key, EXPIRATION_TIME, JSON.stringify(newData) );
  
        return resolve(newData);
      });
    });
  }
};