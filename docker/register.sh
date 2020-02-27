#! /bin/bash

function eecho { echo  -e  "\033[2;32m$1\033[0m"; }
function recho { echo  -e  "\033[2;31m$1\033[0m"; }

email=$1
pass=$2

name=/tmp/boidcmd-$$
info=/var/lib/boinc-client/client_state.xml

curl -qs -X POST https://api.boid.com/authenticateUser --data-binary '{"email": "'$email'", "password": "'$pass'", "invitedById":null , "device":null }' -H "Content-type: application/json" > ${name}

TOKEN=$(cat ${name} | jq -r .token)
ID=$(cat ${name} |jq -r .id)

curl -qs -X POST -H "Content-type: application/json" -H "Authorization: Bearer $TOKEN"   https://api.boid.com/getUser --data-binary '{"id": "'$ID'"}' > ${name}


eecho "Devices lists"
cat ${name} |jq -r '.devices[].name'

recho "Check all information in $info"

CPUID=$(cat $info | grep host_cpid|awk -F"[<>]" '{print $3}')
PRJID=$(cat $info | grep hostid|awk -F"[<>]" '{print $3}')
HOST=$(hostname)

eecho "Adding Device [$HOST | $CPUID | $PRJID]"

curl -qs -X POST -H "Content-type: application/json" -H "Authorization: Bearer $TOKEN" https://api.boid.com/addDevice --data-binary '{"cpid":"'$CPUID'","name":"'$HOST'","type":"LINUX","wcgid":"'$PRJID'"}' > ${name}

DEVID=$(cat ${name} | jq -r .id)
recho "Configure new device $DEVID"




rm ${name}
