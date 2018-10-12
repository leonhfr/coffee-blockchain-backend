#!/usr/bin/env bash
set -o errexit

docker run --rm --name coffeemysql \
  --detach \
  --publish 127.0.0.1:$DB_PORT:$DB_PORT \
  -e MYSQL_ROOT_PASSWORD=$DB_PASS \
  -e MYSQL_DATABASE=$DB_NAME \
  mysql:5

echo -e "\033[0;35m+ populate database\033[0m"
npm run populateDB
