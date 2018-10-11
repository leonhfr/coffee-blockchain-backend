#!/usr/bin/env bash
set -o errexit

docker run --rm --name coffeemysql \
  --detach \
  --publish 127.0.0.1:3306:3306 \
  -e MYSQL_ROOT_PASSWORD=password \
  mysql

echo "+ populate database"
# TODO: add some data to the DB
# npm run populateDB
