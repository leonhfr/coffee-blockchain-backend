#!/usr/bin/env bash
set -o errexit

# store the contracts directory absolute path to mount it in docker
cd "../contracts"
directory="$(pwd)"
cd "../script"

# forward ports 7777 and 5555 to the host (your) machine
# alias a work volume on your local drive to the docker container
# run the nodeos (blockchain node) startup in bash
# keosd = wallet manager
# nodeos = blockchain node
# !!! CORS is enabled for * for developement purposes only
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

# checking block production
echo ""
echo "+ you should see some blocks produced:"
docker logs --tail 3 eosiocoffee
echo "+ nodeos is producing blocks!"

# checking that the server is running and answering
echo ""
echo "+ you should see a JSON response with some info on the blockchain"
curl http://localhost:7777/v1/chain/get_info
echo "+ the blockchain node is answering correctly!"

echo ""
echo "+++ ! The blockchain has started ! +++"

# aliasing cleos to shorten future command lines
# cleos = eos cli
shopt -s expand_aliases
alias cleos="docker exec -it eosiocoffee /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555"

# create a clean data directory to store temporary data and set it as working directory
cd ".."
rm -rf "./data"
mkdir "./data"
cd "./data"

echo ""
echo "+ setup wallet eosiomain"
# create default wallet and save password to file
cleos wallet create -n eosiomain --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosiomain_wallet_password.txt
# import the eos provided private key for eosio system account into default wallet
cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

echo ""
echo "+ setup wallet beancoin"
# wallet for beancoin and export the generated password to a file for unlocking wallet later
cleos wallet create -n beancoin --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > beancoin_wallet_password.txt
# Owner key for blogwallet wallet
cleos wallet import -n beancoin --private-key 5JpWT4ehouB2FF9aCfdfnZ5AwbQbTtHBAwebRXt94FmjyhXwL4K
# Active key for blogwallet wallet
cleos wallet import -n beancoin --private-key 5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N
# create account for beancoin with above wallet's public keys
cleos create account eosio beancoin EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9

echo ""
echo "+ deploy the smart contract"
echo "Note: it is normal to see an error 'Wallet already unlocked'"
# unlocking beancoin's wallet, ignore the error if it's alreday unlocked
cleos wallet unlock -n beancoin --password $(cat ./beancoin_wallet_password.txt) || true
# the contract is already compiled, we just need to deploy it using beancoin's active key
cd ".."
cleos set contract beancoin "$(pwd -P)/contracts/beancoin/" -p beancoin@active

echo ""
echo "+ create mock accounts"
# TODO: create mock accounts

echo ""
echo "+ create mock data"
# TODO: create mock data
