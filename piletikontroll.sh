#!/bin/bash

mkdir -p /data/piletikontroll/code /data/piletikontroll/log
cd /data/piletikontroll/code

git clone -q https://github.com/Piletilevi/piletikontroll.git ./
git checkout -q master
git pull

printf "\n\n"
version=`date +"%y%m%d.%H%M%S"`
docker build --quiet --pull --tag=piletikontroll:$version ./ && docker tag piletikontroll:$version piletikontroll:latest

printf "\n\n"
docker stop piletikontroll
docker rm piletikontroll
docker run -d \
    --net="entu" \
    --name="piletikontroll" \
    --restart="always" \
    --cpu-shares=256 \
    --memory="512m" \
    --env="NODE_ENV=production" \
    --env="VERSION=$version" \
    --env="PORT=80" \
    --env="PL_URL=" \
    --env="NEW_RELIC_APP_NAME=piletikontroll" \
    --env="NEW_RELIC_LICENSE_KEY=" \
    --env="NEW_RELIC_LOG=stdout" \
    --env="NEW_RELIC_LOG_LEVEL=error" \
    --env="NEW_RELIC_NO_CONFIG_FILE=true" \
    --env="SENTRY_DSN=" \
    piletikontroll:latest

printf "\n\n"
docker exec nginx /etc/init.d/nginx reload
