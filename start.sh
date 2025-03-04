#!/bin/sh

#export TEST_MODE=true

#export HTTP_PORT=80
#export HTTPS_PORT=443

export HTTP_PORT=3080
export HTTPS_PORT=3443

#export STATIC_PAGE=/Users/abcde/Desktop/work/aegis/web/dist

#export LOG_DIR=/var/log/aegis
#mkdir -p ${LOG_DIR}

#export MYSQL_HOST=127.0.0.1
#export MYSQL_PORT=3306
#export MYSQL_USER=user1
#export MYSQL_PASSWORD=123456
#export MYSQL_DATABASE=aegis

#export INFLUXDB_URL=http://127.0.0.1:8086
#export INFLUXDB_ORG=my-org
#export INFLUXDB_TOKEN=gsejr384jgtuw3490843

#export NO_COLOR=true

#npm run start:debug 2>&1 > ${LOG_DIR}/aegis.log
#npm run start:debug

npm run start

