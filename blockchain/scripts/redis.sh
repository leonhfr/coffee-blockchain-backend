#!/usr/bin/env bash
set -o errexit

echo -e "\033[0;34m+++ pull redis image from docker hub +++\033[0m"
docker pull redis

echo ""
echo -e "\033[0;34m+++ setup/reset data for container redis_coffeechain +++\033[0m"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop redis_coffeechain || true && docker rm --force redis_coffeechain || true

echo ""
echo -e "\033[0;34m+++ starting database: docker container redis_coffeechain +++\033[0m"
docker run --rm --name redis_coffeechain \
  --detach \
  --publish 127.0.0.1:$REDIS_PORT:6379 \
  redis
