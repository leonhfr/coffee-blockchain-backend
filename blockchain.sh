#!/usr/bin/env bash

#TODO: split in several files

# exit shell if something fails
set -o errexit

echo "+++ starting blockchain +++"
echo ""

# make sure Docker and Node.js are installed
if [ ! -x "$(command -v docker)" ] ||
   [ ! -x "$(command -v node)" ]; then
     echo ""
     echo -e "\033[0;31m[Error with Exception]\033[0m"
     echo "Make sure Docker and Node.js are installed"
     echo ""
     exit
fi

echo "+++ pull eosio/eos image from docker hub +++"
docker pull eosio/eos:v1.3.2

echo ""
echo "+++ setup/reset data for eosio_docker +++"
echo "Note: it is fine to see some errors here"
echo ""
# force remove the previous eosio container if it exists
docker stop eosiocoffee || true && docker rm --force eosiocoffee || true

# TODO: add mysql docker and set it up
echo "TODO: MySQL Docker Component"

cd "$(dirname "$0")/blockchain"
# require the blockchain script
script="./scripts/blockchain.sh"
# store the absolute path to the contracts folder
cd "./contracts"
directory="$(pwd)"
# switch to working folder
cd ".."
mkdir -p "./data"
cd "./data"

# forward ports 7777 and 5555 to the host (your) machine
# alias a work volume on your local drive to the docker container
# run the nodeos (blockchain node) startup in bash
# keosd = wallet manager
# nodeos = blockchain node
# !!! CORS is enabled for * for developmemnt purposes only
docker run --rm --name eosiocoffee \
  --detach \
  --publish 7777:7777 \
  --publish 127.0.0.1:5555:5555 \
  --volume "$directory:$directory" \
  eosio/eos:v1.3.2 \
  /bin/bash -c \
  "keosd --http-server-address=0.0.0.0:5555 & exec \
  nodeos -e -p eosio \
    --plugin eosio::producer_plugin \
    --plugin eosio::history_plugin \
    --plugin eosio::chain_api_plugin \
    --plugin eosio::history_api_plugin \
    --plugin eosio::http_plugin \
    -d /mnt/dev/data \
    --config-dir /mnt/dev/config \
    --http-server-address=0.0.0.0:7777 \
    --access-control-allow-origin=* \
    --http-validate-host=false \
    --contracts-console \
    --filter-on='*'"

# sleep for 2 seconds to allow time to create some blocks
sleep 2s

echo "+++ you should see some blocks produced: +++"
echo ""

docker logs --tail 3 eosiocoffee

echo ""
echo "+++ nodeos is producing blocks! +++"
echo ""
echo "+++ you should see a JSON response with empty wallets +++"
echo "Note: that means that the blockchain node is answering correctly"
echo ""

curl http://localhost:7777/v1/chain/get_info

echo ""
echo "+++ blockchain started +++"
echo ""

# aliasing cleos to shorten future command lines
# cleos = eos cli
shopt -s expand_aliases
alias cleos="docker exec -it eosiocoffee /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555"

echo "+ setup wallet eosiomain"
# create default wallet and save password to file
cleos wallet create -n eosiomain --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosiomain_wallet_password.txt
# import the eos provided private key for eosio system account into default wallet
cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

echo "+ setup wallet beancoin"
# wallet for beancoin and export the generated password to a file for unlocking wallet later
cleos wallet create -n beancoin --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > beancoin_wallet_password.txt
# Owner key for blogwallet wallet
cleos wallet import -n beancoin --private-key 5JpWT4ehouB2FF9aCfdfnZ5AwbQbTtHBAwebRXt94FmjyhXwL4K
# Active key for blogwallet wallet
cleos wallet import -n beancoin --private-key 5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N
# create account for beancoin with above wallet's public keys
cleos create account eosio beancoin EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9

# TODO: deploy smart contract
# TODO: create mock accounts
# TODO: create mock data

echo ""
echo "+++ npm install for the backend app +++"
echo ""
# npm install

echo "+++ starting backend +++"
echo "After this you should be ablo to interact with the blockchain and the backend with the frontend"
echo ""
# npm start
