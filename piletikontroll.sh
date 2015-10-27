#!/bin/bash

mkdir -p /data/piletikontroll/code
cd /data/piletikontroll/code

git clone -q https://github.com/Piletilevi/piletikontroll.git ./
git checkout -q master
git pull
printf "\n\n"

version=`date +"%y%m%d.%H%M%S"`
docker build -q -t piletikontroll:$version ./ && docker tag -f piletikontroll:$version piletikontroll:latest
printf "\n\n"

docker stop piletikontroll
docker rm piletikontroll
docker run -d \
    --name="piletikontroll" \
    --restart="always" \
    --memory="512m" \
    --env="PORT=80" \
    --env="PL_URL=" \
    --env="NEW_RELIC_APP_NAME=piletikontroll" \
    --env="NEW_RELIC_LICENSE_KEY=" \
    --env="NEW_RELIC_LOG=stdout" \
    --env="NEW_RELIC_LOG_LEVEL=error" \
    --env="NEW_RELIC_NO_CONFIG_FILE=true" \
    --env="SENTRY_DSN=" \
    piletikontroll:latest

docker inspect -f "{{ .NetworkSettings.IPAddress }}" piletikontroll
printf "\n\n"

/data/nginx.sh
