#!/usr/bin/env bash
set -o errexit

docker run --rm --name redis_coffeechain \
  --detach \
  --publish 127.0.0.1:$REDIS_PORT:$REDIS_PORT \
  redis

# $ docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379
