<a href="https://www.boid.com/"><img src="https://raw.githubusercontent.com/Boid-John/eos-airdrops/master/logos/BoidLogo-lg.png" title="Boid" alt="Boid"></a>

<p align="center">
    <a href="https://t.me/Boidcom_official">
        <img src="https://img.shields.io/discord/431917998102675485.svg" alt="Telegram">
    </a>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="MIT License">
    </a>
    <a href="https://twitter.com/boidcom">
        <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social&style=plastic" alt="Twitter">
    </a>
</p>


# Boid CLI

> A linux command line interface for Boid 

### From a fresh Debian/Ubuntu install:
```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
logout and log back in to the shell.
command -v nvm

nvm install node
```
##### This CLI has only been tested on Debian and Ubuntu based distributions.


### Setup

> install this package first

```shell
$ npm install boidcmd -g
```

##### REQUIRED: you must first install boinc-client package. 
sudo apt install boinc-client -y

Make sure to check that it is running, this can be done with the command:
```shell
$ boinccmd --get_state
```
if you get an authentication error code -155 , you will have to blank out the password
in the file /etc/boinc-client/gui_rpc_auth.cfg ( the file just needs to be empty)
and restart the boinc-client service.

```shell
$ service boinc-client restart
or
$ systemctl restart boinc-client
```

> now setup boid by typing the following command:

```shell
$ boidcmd setup
```

> additional commands can be found in the help menu

```shell
$ boidcmd help
```
