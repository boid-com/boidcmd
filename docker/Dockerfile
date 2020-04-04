## docker build -t boinc:latest .
## docker run -d -e EMAIL=yourboidemail.com -e EMAIL_PASS=PASS -h hostname --name hostname boinc

## if you want to check docker exec -it hostname bash

FROM debian:jessie
RUN apt update -y && apt install -y boinc-client jq curl
USER boinc
RUN touch ~boinc/.bashrc
COPY	register.* /tmp/
CMD 	(sleep 10; boinccmd --project_attach http://www.worldcommunitygrid.org/ 1061556_a0c611b081f8692b7ef0c11d39e6105c )& \
	(sleep 100; /tmp/register.sh $EMAIL $EMAIL_PASS) & \
	/usr/bin/boinc --dir /var/lib/boinc-client --allow_remote_gui_rpc ; \
	boinccmd --project http://www.worldcommunitygrid.org/ detach

