const Store = require('data-store');
var https = require('https');
var exports = module.exports = {};
const store = new Store({ path: 'config.json' });

 /*exports.setupClient = function(token) {
  if (token) {
    client = new GraphQLClient(gqlEndpoint, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
    // console.log(token)
  }
  else {
    client = new GraphQLClient(gqlEndpoint)
  }
}

exports.login = function(formData,callback){
    try{
        client.request(m.auth.authenticateUser(), formData).then(data => {
            
            store.set({"userData": data });
            callback(data)
        })
    }catch(err){
        console.log(err)
    }
}
exports.signup = function(formData,callback){
    client.request(m.auth.signupUser(), formData).then(data => {
        store.set({"userData": data });
        console.log(data)
        callback(data)
    })
}
exports.logout = function(){
    localStorage.clear()
    //this.setupClient()
}

exports.getUser = function(userId,callback){
    client.request(q.user.get(), { userId }).then( data => {
        console.log(data)
        callback(data)
    }).catch(console.error)
}

exports.updateDevice = function(device,callback){
    client.request(m.device.updateStatus(data => {
        console.log(data)
        callback(data)
    }), device).then().catch(console.error)
}

exports.updateWcgid = function(device,callback){
    // console.log('UPDATE WCGID',device)
    client.request(m.device.updateWcgid(), device).then(data => {
        console.log(data)
        callback(data)
    }).catch(console.error)
}

exports.create = function(deviceData,callback){
    client.request(m.device.create(), deviceData).then(data => {
        console.log(data)
        callback(data)
    }).catch(console.error)
}

exports.get = function(deviceId,callback){
    client.request(q.device.get(),{deviceId}).then(data => {
        console.log(data)
        callback(data)
    }).catcuserDataconsole.error)
}

exports.add = function(deviceData,callback){
    try {
        client.request(m.device.add(),deviceData).then(data => {
            console.log(data)
            callback(data)
        }).catch(console.error)
    }catch(err){
        console.log(err)
    }
}*/

var userData = undefined

exports.setUserData = function(obj){
    userData = obj
}

exports.send = function(obj,endPoint,callback) {
    var options;
    if(userData == undefined){
        options = {
            'method': 'POST',
            'hostname': 'api.boid.com',
            'path': endPoint,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': ''
            }
        };
    }else{
        options = {
            'method': 'POST',
            'hostname': 'api.boid.com',
            'path': endPoint,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+userData.token
            }
        };
        
    }
    
    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        var data = body.toString()
        callback(data)
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    var postData =  JSON.stringify(obj);

    req.write(postData);

    req.end();
}

exports.endPoint = {
    validatePayoutAccountRequest:"/validatePayoutAccountRequest",
    updatePayoutAccount:"/updatePayoutAccount",
    authenticateUser:"/authenticateUser",
    signUpUser:"/signUpUser",
    updateDevice:"/updateDevice",
    addDevice:"/addDevice",
    updateUserProfile:"/updateUserProfile",
    checkUsername:"/checkUsername",
    getUser:"/getUser",
    getDevice:"/getDevice",
    globalLeaderboard:"/globalLeaderboard",
    teamsLeaderboard:"/teamsLeaderboard",
    teamLeaderboard:"/teamLeaderboard",
    getTeam:"/getTeam"
}