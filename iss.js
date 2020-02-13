const request = require("request");
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org?format=json",(error, response, body) => {
    console.log(body);
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

module.exports = { fetchMyIP };