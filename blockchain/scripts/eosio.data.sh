#!/usr/bin/env bash
set -o errexit

echo ""
echo -e "\033[0;35m+ downloading jq (json reader) to create mock data\033[0m"
cd "$(pwd -P)/blockchain/scripts"
mkdir -p ~/bin && curl -sSL -o ~/bin/jq \
  https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && \
  chmod +x ~/bin/jq && export PATH=$PATH:~/bin

echo ""
echo -e "\033[0;35m+ create mock accounts and register them\033[0m"
jq -c '.[]' mock.data.user.json | while read i; do
  name=$(jq -r '.name' <<< "$i")
  pubkey=$(jq -r '.publicKey' <<< "$i")
  privkey=$(jq -r '.privateKey' <<< "$i")
  role=$(jq -r '.role' <<< "$i")
  hash=$(jq -r '.hash' <<< "$i")

  docker exec -t eosio_coffeechain /opt/eosio/bin/cleos \
    --url http://127.0.0.1:$EOSIO_NETWORK_PORT \
    --wallet-url http://127.0.0.1:$EOSIO_WALLET_PORT \
    create account eosio $name $pubkey $pubkey

  docker exec -t eosio_coffeechain /opt/eosio/bin/cleos \
    --url http://127.0.0.1:$EOSIO_NETWORK_PORT \
    --wallet-url http://127.0.0.1:$EOSIO_WALLET_PORT \
    wallet import -n beancoin --private-key $privkey

  docker exec -t eosio_coffeechain /opt/eosio/bin/cleos \
    --url http://127.0.0.1:$EOSIO_NETWORK_PORT \
    --wallet-url http://127.0.0.1:$EOSIO_WALLET_PORT \
    push action beancoin upsertuser \
    "[ "\""$name"\"", "\""$role"\"", "\""$hash"\"" ]" \
    -p $name@active
done

echo ""
echo -e "\033[0;35m+ create mock coffees\033[0m"
jq -c '.[]' mock.data.coffee.json | while read i; do
  name=$(jq -r '.producer_name' <<< "$i")
  uuid=$(jq -r '.id' <<< "$i")
  hash=$(jq -r '.hash' <<< "$i")
  price=$(jq -r '.price' <<< "$i")
  quantity=$(jq -r '.quantity' <<< "$i")

  docker exec -t eosio_coffeechain /opt/eosio/bin/cleos \
    --url http://127.0.0.1:$EOSIO_NETWORK_PORT \
    --wallet-url http://127.0.0.1:$EOSIO_WALLET_PORT \
    push action beancoin upsertcoffee \
    "[ "\""$name"\"", $uuid, "\""$hash"\"", $price, $quantity ]" \
    -p $name@active
done
