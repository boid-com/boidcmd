
# Docker install instructions

The following docker container uses Debian Jessie as its base level OS.
Pre-requirement are just docker on the Host OS.
I have tested this process on CentOS 6 and CentOS 7

```
git clone https://github.com/boidcmd/boidcmd.git
cd docker
docker build -t boinc:latest .
```

To start the docker container you will need to pass your BOID email and password so that it can register the device with your account.
The docker container needs a unique MAC address , because by default it uses the same virtual MAC address everytime you start a container.
I typically just pass it the MAC address of the host as i don't run more than one BOINC container per HOST.
Finally the desired docker device name is the name you will see on app.boid.com so choose wisely.

```
docker run -d -e EMAIL=YOUR_BOID_EMAIL -e EMAIL_PASS=YOUR_BOID_PASSWORD -h YOUR_DOCKER_DESIRED_DEVICE_NAME --mac-address HOSTMACADDRESS --name boinc boinc
```

It will automatically register this device with api.boid.com and start boinc
After that you can stop/start the container at will or exec into it if you want to check on its state, 
I typically run the following command inside the container:

```
boinccmd --get_state | egrep -e "host_total_credit|jobs|elapsed time"
```




