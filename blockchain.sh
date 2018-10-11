#!/usr/bin/env bash

# exit shell if something fails
set -o errexit

echo "+++ starting blockchain and backend +++"

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
echo "TODO: MySQL Docker Component"
# TODO: add mysql docker and set it up

echo ""
echo "+++ pull eosio/eos image from docker hub +++"
docker pull eosio/eos:v1.3.2

echo ""
echo "+++ setup/reset data for container eosiocoffee +++"
echo "Note: it is fine to see some errors here"
# force remove the previous eosio container if it exists
docker stop eosiocoffee || true && docker rm --force eosiocoffee || true

echo ""
echo "+++ starting Docker container eosiocoffee +++"

cd "./blockchain/script"
./eosio.sh

# switch to root folder
cd "../.."
echo ""
echo "+++ npm install for the backend app +++"
echo ""
# npm install

echo ""
echo "+++ starting backend +++"
echo "After this you should be able to interact with the blockchain and the backend with the frontend"
echo ""
# npm start
# TODO: add a script to add some data to the DB
