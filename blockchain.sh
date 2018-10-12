#!/usr/bin/env bash

# exit shell if something fails
set -o errexit

echo "\033[0;34m+++ starting blockchain and backend +++\033[0m"

# make sure Docker and Node.js are installed
if [ ! -x "$(command -v docker)" ] ||
   [ ! -x "$(command -v node)" ]; then
     echo ""
     echo -e "\033[0;31m[Error with Exception]\033[0m"
     echo "Make sure Docker and Node.js are installed"
     echo ""
     exit
fi

echo ""
echo "\033[0;34m+++ npm install for the backend app +++\033[0m"
echo ""
npm install

echo "\033[0;34m+++ pull mysql image from docker hub +++\033[0m"
docker pull mysql:5

echo ""
echo "\033[0;34m+++ setup/reset data for container coffeemysql +++\033[0m"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop coffeemysql || true && docker rm --force coffeemysql || true

echo ""
echo "\033[0;34m+++ starting database: docker container coffeemysql +++\033[0m"
sh -ac '. ./.env; ./blockchain/scripts/mysql.sh'

echo ""
echo "\033[0;34m+++ pull eosio/eos image from docker hub +++\033[0m"
docker pull eosio/eos:v1.3.2

echo ""
echo "\033[0;34m+++ setup/reset data for container eosiocoffee +++\033[0m"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop eosiocoffee || true && docker rm --force eosiocoffee || true

echo ""
echo "\033[0;34m+++ starting blockchain: docker container eosiocoffee +++\033[0m"
sh -ac '. ./.env; ./blockchain/scripts/eosio.sh'

echo ""
echo "\033[0;34m+++ starting backend API +++\033[0m"
echo "After this you should be able to interact with the blockchain and the backend with the frontend"
echo ""
npm start
