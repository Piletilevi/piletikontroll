#!/bin/bash

mkdir -p /data/piletikontroll/code /data/piletikontroll/log
cd /data/piletikontroll/code

git clone https://github.com/Piletilevi/piletikontroll.git ./
git checkout master
git pull

version=`date +"%y%m%d.%H%M%S"`

docker build -q -t piletikontroll:$version ./ && docker tag -f piletikontroll:$version piletikontroll:latest
docker kill piletikontroll
docker rm piletikontroll
docker run -d \
    --name="piletikontroll" \
    --restart="always" \
    --memory="256m" \
    --env="PORT=80" \
    --env="PL_URL=" \
    --env="NEW_RELIC_APP_NAME=piletikontroll" \
    --env="NEW_RELIC_LICENSE_KEY=" \
    --env="NEW_RELIC_LOG=stdout" \
    --env="NEW_RELIC_LOG_LEVEL=error" \
    --env="NEW_RELIC_NO_CONFIG_FILE=true" \
    --volume="/data/piletikontroll/log:/usr/src/piletikontroll/log" \
    piletikontroll:latest

/data/nginx.sh
