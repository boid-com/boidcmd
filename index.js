var cmd = require('node-cmd')
var convert = require('xml-js')
var fs = require('fs')
var client = require("./api.js")
const minimist = require('minimist')
const ora = require('ora')
const spinner = ora()
const readline = require('readline')
const { spawn } = require('child_process')
var form = {
    email: '',
    password: '',
    invitedById: null,
    device: null
  }

var projectObject = {
    deviceId: '',
    wcgid: ''
}

module.exports = () => {
    const args = minimist(process.argv.slice(2))
    var boidcmd = args._[0]
    var value = args._[1]

    if(args.version || args.v) {
        boidcmd = 'version'
    }

    if(args.help || args.h || args._[0] == undefined) {
        boidcmd = 'help'
    }

    switch (boidcmd) {
        case 'setCPU':
        setCPU(value)
        break
        case 'setup':
        setupBoid()
        break
        case 'install':
        installBoid()
        break
        case 'run':
        runBoid()
        break
        case 'quit':
        quitBoid()
        break
        case 'resume':
        resume()
        break
        case 'suspend':
        suspend()
        break
        case 'status':
        status()
        break
        case 'help':
        require('./help')
        break
        case 'version':
        require('./version')
        break
        default:
        console.error(`"${boidcmd}" is not a valid command!`)
        break
    }
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupBoid(){
    var form = {}
    rl.stdoutMuted = false
    rl.question('Boid Account Email:', (email) => {
        form.email = email
        rl.question('Boid Account Password: ', (password) => {
            form.password = password
            client.send(form,client.endPoint.authenticateUser,function(response){
                response = JSON.parse(response)
                if (response.invalid){
                    console.log()
                    console.log(response.invalid)
                    return setupBoid()
                }
                client.setUserData(response)
                rl.close()
                setupBoinc()
            })
        })
        rl.stdoutMuted = true
        // rl.history = rl.history.slice(1)
    })
    
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted)
        rl.output.write("*")
      else
        rl.output.write(stringToWrite)
    }
}

function runBoid(){
    const subprocess = spawn('boinc',['--dir', '/var/lib/boinc-client/', '--daemon', '--allow_remote_gui_rpc'], {
        detached: true,
        stdio: 'ignore'
      });
      
      subprocess.unref();
}

function quitBoid(){
    cmd.get(
        `
            boinccmd kill
        `,
        function(err, data, stderr){
            if (!err) {
            } else {
               console.log('error', err)
            }
        }
    );
}

function installBoid() {
    cmd.get(
        `
            sudo apt install boinc-client -y
            boinccmd --project_attach http://www.worldcommunitygrid.org/ 1061556_a0c611b081f8692b7ef0c11d39e6105c
        `,
        function(err, data, stderr){
            if (!err) {
                console.log("waiting for project information")
                spinner.start()
                setTimeout(projectCheck,3000)
            } else {
               console.log('error', err)
            }
    
        }
    );
}

function projectCheck(){
    fs.readFile( '/var/lib/boinc-client/client_state.xml', function(err, data) {
        var result1 = convert.xml2json(data, {compact: true, spaces: 4});
        var object = JSON.parse(result1);
        var hostInfo = object.client_state.host_info
        var project = object.client_state.project
        var name = hostInfo.domain_name._text
        var cpid = hostInfo.host_cpid._text
        var threads = hostInfo.p_ncpus._text
        var model = hostInfo.p_model._text
        var wcgid = project.hostid._text
        if(wcgid == "0"){
            setTimeout(projectCheck,3000)
        }else{
            spinner.stop()
            console.log("Success!")
        }
     });
}

function valBetween(v, min, max) {
    return Math.min(max, Math.max(min, v))
}

function setCPU(value){
    fs.readFile( '/var/lib/boinc-client/global_prefs_override.xml', function(err, data) {
        var cpuPercent = valBetween(value * 1 + 15, 70, 100)
        console.log(cpuPercent)
        var result1 = convert.xml2json(data, {compact: true, spaces: 4});
        var object = JSON.parse(result1);
        object.global_preferences.cpu_usage_limit = cpuPercent
        var options = {compact:true, ignoreComment:true, spaces:4};
        var xmlResult = convert.json2xml(object,options);
        console.log(object)
        console.log(xmlResult)
        fs.writeFile('/var/lib/boinc-client/global_prefs_override.xml',xmlResult,function(err){
            if (err) throw err;
            readGlobalPrefsOverride()
        })
     });
}

function readGlobalPrefsOverride(){
    spinner.start()
    cmd.get(
        `
            boinccmd --read_global_prefs_override
        `,
        function(err, data, stderr){
            if (!err) {
                console.log("Sucessfully set cpu limit")
                spinner.stop()       
            } else {
               console.log('error', err)
            }
        }
    );
}

function setupBoinc(){
    cmd.get(
        `
            sudo apt install boinc-client -y
            boinccmd --project_attach http://www.worldcommunitygrid.org/ 1061556_a0c611b081f8692b7ef0c11d39e6105c
        `,
        function(err, data, stderr){
            if (!err) {
                console.log("waiting for project information")
                spinner.start()
                setTimeout(readFiles,3000)
               
            } else {
                // if (error.search(''))
               console.log('error', err)
               setTimeout(readFiles,3000)
            }
        }
    );
}

function resume() {
    cmd.get(
        `
            boinccmd --project http://www.worldcommunitygrid.org/ resume 
        `,
        function(err, data, stderr){
            if (!err) {
               console.log(data)
               console.log(stderr)
               process.exit(0);
            } else {
               console.log('error', err)
            }
    
        }
    );
}

function suspend() {
    cmd.get(
        `
            boinccmd --project http://www.worldcommunitygrid.org/ suspend 
        `,
        function(err, data, stderr){
            if (!err) {
               console.log(data)
               console.log(stderr)
               process.exit(0);
            } else {
               console.log('error', err)
            }
    
        }
    );
}

function status() {
    cmd.get(
        `
            boinccmd --get_simple_gui_info 
        `,
        function(err, data, stderr){
            if (!err) {
               console.log(data)
               console.log(stderr)
               process.exit(0);
            } else {
               console.log('error', err)
            }
    
        }
    );
}

function readFiles(callback) {
    fs.readFile( '/var/lib/boinc-client/client_state.xml', function(err, data) {
        var result1 = convert.xml2json(data, {compact: true, spaces: 4});
        var object = JSON.parse(result1);
        var hostInfo = object.client_state.host_info
        var project = object.client_state.project
        var name = hostInfo.domain_name._text
        var cpid = hostInfo.host_cpid._text
        var threads = hostInfo.p_ncpus._text
        var model = hostInfo.p_model._text
        var wcgid = project.hostid._text
        if(wcgid == "0"){
            
            setTimeout(readFiles,3000)
            
        }else{
            spinner.stop()
            projectObject.wcgid = wcgid
            var device = {
                cpid:cpid,
                //cpid:makeid(),
                name:name,
                type:"LINUX"
            }
            console.log("Adding device to boid account")
            client.send(device,client.endPoint.addDevice,function(obj){
                var json = JSON.parse(obj)
                if(json.error != undefined) {
                    console.log("error adding Device")
                }else{
                    console.log("Added device to boid account")
                    console.log(json)
                    var deviceId = json.id
                    client.send({"id":deviceId},client.endPoint.getDevice,function(obj){
                        var json = JSON.parse(obj)
                        projectObject.deviceId = json.id
                        client.send(projectObject,client.endPoint.updateDevice,function(obj){
                            var json = JSON.parse(obj)
                            console.log(json)
                            console.log("Setting up project")
                            if (json.error == undefined) {
                                //console.log(json.error)
                            }else{
                                client.send({"id":projectObject.deviceId},client.endPoint.getDevice,function(obj){
                                    var json = JSON.parse(obj)
                                    if(json.wcgid != null){
                                        if(projectObject.wcgid == json.wcgid){
                                            console.log("Success!")
                                        }else {
                                            console(" Device is using a difference wcgid wcgid:"+json.wcgid)
                                        }
                                    }else{
                                        //some other issue caused a problem
                                    }
                                    console.log('Setup complete. Run "boidcmd status" to view project status')
                                    process.exit(0);
                                })
                            }
                        })
                    })
                }
            })
        }
     });
}

// sudo aptitude install boinc-client
// sudo aptitude purge boinc-client
//
//

//fake cpid

/*function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }*/
  