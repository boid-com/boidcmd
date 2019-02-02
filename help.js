const chalk = require('chalk');
const log = console.log;
const menus = {
    main:`
    boidcmd [command] <options>

    ${chalk.red('To uninstall boid-cli run "sudo apt purge boinc-client" then uninstall the boid-cli module')}

    setup .............. sets up boid for the first time should only run once
    install ............ attaches project and starts work if device is curently attached to an account
    run ................ starts boid process
    quit ............... stops boid process
    setCPU <option> .... sets percentage of cpu usage based on option can be either Int or Float  
    resume ............. resumes all work for currrent project
    suspend ............ suspends all work for current project
    status ............. shows status for all tasks
    version ............ show package version
    help ............... show help menu for a command
    
    `
}
console.log(menus.main)
process.exit(0);