const request = require("request");
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json",(error, response, body) => {
   
    if (error) {
      callback(error,null);
      return;
    }  else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
    
      let obj = JSON.parse(body);
      callback(null,obj["ip"]);
      return;
    }
  });
  
};

const fetchCoordsByIP = function(ip,callback) {
  // use request to fetch IP address from JSON API
  request("https://ipvigilante.com/" + ip,(error, response, body) => {
    let cordinates = {};
    
    if (error) {
      callback(error,null);
      return;
    }  else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
    
      let obj = JSON.parse(body);
      cordinates["latitude"] = obj["data"].latitude;
      cordinates["longitude"] = obj["data"].longitude;
      

      callback(null,cordinates);
      return;
    }
  });
  
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request("http://api.open-notify.org/iss-pass.json?lat=" + coords.latitude + "&lon=" + coords.longitude  ,(error, response, body) => {
       
    if (error) {
      callback(error,null);
      return;
    }  else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching. Response: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let obj = JSON.parse(body);
      
      callback(null,obj.response);
      return;
    }
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error,ip) =>{
    if (error) {
      return callback(error,null);
    }

    fetchCoordsByIP(ip,(error, loc) => {
      if (error) {
        return callback(error,null);
      }
    
      fetchISSFlyOverTimes(loc,(error, nextPasses) => {
        if (error) {
          return callback(error,null);
        }
      
        callback(null, nextPasses);

      });
       
     
    });



  });
       
};



module.exports = {
  nextISSTimesForMyLocation
};