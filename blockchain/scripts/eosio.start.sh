#!/usr/bin/env bash
set -o errexit

echo ""
echo -e "\033[0;34m+++ pull eosio/eos image from docker hub +++\033[0m"
docker pull eosio/eos:v1.3.2

echo ""
echo -e "\033[0;34m+++ setup/reset data for container eosio_coffeechain +++\033[0m"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop eosio_coffeechain || true && docker rm --force eosio_coffeechain || true

echo ""
# store the contracts directory absolute path to mount it in docker
directory="$(pwd -P)/blockchain/contracts"

# forward ports 7777 and 5555 to the host (your) machine
# alias a work volume on your local drive to the docker container
# run the nodeos (blockchain node) startup in bash
# keosd = wallet manager
# nodeos = blockchain node
# !!! CORS is enabled for * for developement purposes only
echo -e "\033[0;34m+++ starting blockchain: docker container eosio_coffeechain +++\033[0m"
docker run --rm --name eosio_coffeechain \
  --detach \
  --publish $EOSIO_NETWORK_PORT:$EOSIO_NETWORK_PORT \
  --publish 127.0.0.1:$EOSIO_WALLET_PORT:$EOSIO_WALLET_PORT \
  --volume "$directory:$directory" \
  eosio/eos:v1.3.2 \
  /bin/bash -c \
  "keosd --http-server-address=0.0.0.0:$EOSIO_WALLET_PORT & exec \
  nodeos -e -p eosio \
    --plugin eosio::producer_plugin \
    --plugin eosio::history_plugin \
    --plugin eosio::chain_api_plugin \
    --plugin eosio::history_api_plugin \
    --plugin eosio::http_plugin \
    -d /mnt/dev/data \
    --config-dir /mnt/dev/config \
    --http-server-address=0.0.0.0:$EOSIO_NETWORK_PORT \
    --access-control-allow-origin=* \
    --http-validate-host=false \
    --contracts-console \
    --filter-on='*'"

# sleep for 2 seconds to allow time to create some blocks
sleep 2s

# checking block production
echo ""
echo "+ you should see some blocks produced:"
docker logs --tail 3 eosio_coffeechain
echo -e "\033[0;35m+ nodeos is producing blocks!\033[0m"

# checking that the server is running and answering
echo ""
echo "+ you should see a JSON response with some info on the blockchain"
curl http://$EOSIO_NETWORK_HOST:$EOSIO_NETWORK_PORT/v1/chain/get_info
echo ""
echo -e "\033[0;35m+ nodeos is answering correctly!\033[0m"

echo ""
echo -e "\033[0;34m+++ /!\ The blockchain has started! /!\ +++\033[0m"
