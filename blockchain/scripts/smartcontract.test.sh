#!/usr/bin/env bash

# run the script from the /blockchain/scripts directory

echo "\033[0;34m+ aliasing cleos\033[0m"
alias cleos="docker exec -t eosio_coffeechain /opt/eosio/bin/cleos \
  --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555"

echo "\033[0;34m+ unlocking wallets just in case, errors are fine\033[0m"
cleos wallet unlock -n beancoin \
  --password $(cat ../data/beancoin_wallet_password.txt) || true

cleos wallet unlock -n eosiomain \
  --password $(cat ../data/eosiomain_wallet_password.txt) || true

echo "\033[0;34m+ creating account in case it is the first \
  time the script is run, an error is fine otherwise\033[0m"
cleos create account eosio testaccount \
  EOS7hmDNU2NJZtkS4EPoSw3pfXAg3MXSBv3aRw3FVZPW8M5hypfi8 \
  EOS7hmDNU2NJZtkS4EPoSw3pfXAg3MXSBv3aRw3FVZPW8M5hypfi8

echo "\033[0;34m+ importing ket in beancoin's wallet, fine to see error\033[0m"
cleos wallet import -n beancoin \
  --private-key 5JokXZ1N1b9skb6dwyTbv9jqmTuoRKsqBACS86No7cZekbA778f

### TESTS: USERS ###

### INSERTING USER

echo "\033[0;34m+ should be able to insert user\033[0m"
cleos push action beancoin upsertuser \
  "[ \"testaccount\", \"consumer\", \"testhash\" ]" \
  -p testaccount@active

### GET USER

echo "\033[0;34m+ should be able to get own information\033[0m"
cleos push action beancoin getuser \
"[ \"testaccount\" ]" \
-p testaccount@active

echo "\033[0;34m+ should be able to get some else's information\033[0m"
cleos push action beancoin getuser \
"[ \"testaccount\" ]" \
-p testaccount@active

### UPDATING USER

echo "\033[0;34m+ should be able to update user\033[0m"
cleos push action beancoin upsertuser \
  "[ \"testaccount\", \"consumer\", \"newtesthash\" ]" \
  -p testaccount@active

### DELETE USER

echo "\033[0;34m+ should not be able to delete another user's data\033[0m"
cleos push action beancoin deluser \
  "[ \"leonh\" ]" \
  -p testaccount@active

echo "\033[0;34m+ should be able to delete user's own data (one assertion error expected)\033[0m"
cleos push action beancoin deluser \
  "[ \"testaccount\" ]" \
  -p testaccount@active
cleos push action beancoin getuser \
  "[ \"testaccount\" ]" \
  -p testaccount@active
cleos push action beancoin upsertuser \
  "[ \"testaccount\", \"consumer\", \"testhash\" ]" \
  -p testaccount@active
