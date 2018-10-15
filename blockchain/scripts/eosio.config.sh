#!/usr/bin/env bash
set -o errexit

# aliasing cleos to shorten future command lines
# cleos = eos cli
shopt -s expand_aliases
alias cleos="docker exec -i eosio_coffeechain /opt/eosio/bin/cleos \
  --url http://127.0.0.1:$EOSIO_NETWORK_PORT --wallet-url http://127.0.0.1:$EOSIO_WALLET_PORT"

# create a clean data directory to store temporary data and set it as working directory
rm -rf "$(pwd -P)/blockchain/data"
mkdir "$(pwd -P)/blockchain/data"
cd "$(pwd -P)/blockchain/data"

echo ""
echo -e "\033[0;35m+ setup wallet eosiomain\033[0m"
echo -e "\033[0;35m+ this would not be needed to connect to the real EOS network, it is for test purposes only\033[0m"
# create default wallet and save password to file
cleos wallet create -n eosiomain --to-console | tail -1 | \
  sed -e 's/^"//' -e 's/"$//' > eosiomain_wallet_password.txt
# import the eos provided private key for eosio system account into default wallet
cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3

echo ""
echo -e "\033[0;35m+ setup wallet beancoin\033[0m"
# wallet for beancoin and export the generated password to a file for unlocking wallet later
cleos wallet create -n beancoin --to-console | tail -1 | \
  sed -e 's/^"//' -e 's/"$//' > beancoin_wallet_password.txt
# create account for beancoin with above wallet's public keys
cleos create account eosio beancoin EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B \
  EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9
# Owner key
cleos wallet import -n beancoin \
--private-key 5JpWT4ehouB2FF9aCfdfnZ5AwbQbTtHBAwebRXt94FmjyhXwL4K
# Active key
cleos wallet import -n beancoin \
--private-key 5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N

echo ""
echo -e "\033[0;35m+ deploy the smart contract\033[0m"
echo "Note: it is normal to see an error 'Wallet already unlocked'"
# unlocking beancoin's wallet, ignore the error if it's alreday unlocked
#
cleos wallet unlock -n beancoin --password $(cat ./beancoin_wallet_password.txt) || true
# the contract is already compiled, we just need to deploy it using beancoin's active key
cd ..
cleos set contract beancoin "$(pwd -P)/contracts/beancoin/" -p beancoin@active
