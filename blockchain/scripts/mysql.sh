#!/usr/bin/env bash
set -o errexit

echo -e "\033[0;34m+++ pull mysql image from docker hub +++\033[0m"
docker pull mysql:5

echo ""
echo -e "\033[0;34m+++ setup/reset data for container mysql_coffeechain +++\033[0m"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop mysql_coffeechain || true && docker rm --force mysql_coffeechain || true

echo ""
echo -e "\033[0;34m+++ starting database: docker container mysql_coffeechain +++\033[0m"
docker run --rm --name mysql_coffeechain \
  --detach \
  --publish 127.0.0.1:$DB_PORT:3306 \
  -e MYSQL_ROOT_PASSWORD=$DB_PASS \
  -e MYSQL_DATABASE=$DB_NAME \
  mysql:5
