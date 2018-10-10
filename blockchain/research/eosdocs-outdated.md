# EOS

## Installation

https://docs.docker.com/install/linux/docker-ce/ubuntu/

Password of `default` wallet:

## Working Process (so far)

```shell
docker pull eosio/eos
docker run --rm -it eosio/eos bash

# "cleos" in shell returns an error, it's working

docker network create eosnetwork

docker run --name server --network=eosnetwork --rm -p 7777:7777 -i eosio/eos /bin/bash -c "nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --http-validate-host=false"

# todo: add eosio::history_api_plugin
# required to search for accounts by public key
# separate term windows

docker run --name wallet --network=eosnetwork --rm -p 5555:5555 -i eosio/eos /bin/bash -c "keosd --http-server-address=0.0.0.0:5555 --http-validate-host=false"

# separate term windows

docker run --name tools --network=eosnetwork --rm -it eosio/eos /bin/bash
```

Checking if it works

```shell
cleos -u http://server:7777 get info
```

Should return a JSON object

In tools:

```shell
# create default wallet
cleos --wallet-url http://wallet:5555 wallet create --to-console

# store the password returned:
PW5KC8VFAHT2bGeNgNDPd4XXfFaCiFCVEEiXzk9GHyNFKFPV1gzAQ

# create key pairs
# 1 OWNER
cleos create key --to-console
Private key: 5KXwzvk8X1JUq6RpULVMTMHxjDUoWRHneKzGYi5Te24Loao26nN
Public key: EOS7Gr76LMiNMs6NVq2pCD2Fvxg8q5p31oNxNGgmXdyCMEbNXDBUm
# 2 ACTIVE
cleos create key --to-console
Private key: 5KckhpgPMMgkVK2xWoChasqF1axdXzvMCAJ7c4as8J4kL6xe4mV
Public key: EOS5DkoCKtmUahPqrSHkAWwxbSfYjMJAoKA364L8HRwG1WLqA1RGk

# import keys in the default wallet
cleos --wallet-url http://wallet:5555 wallet import --private-key 5KXwzvk8X1JUq6RpULVMTMHxjDUoWRHneKzGYi5Te24Loao26nN
imported private key for: EOS7Gr76LMiNMs6NVq2pCD2Fvxg8q5p31oNxNGgmXdyCMEbNXDBUm

# again
cleos --wallet-url http://wallet:5555 wallet import --private-key 5KckhpgPMMgkVK2xWoChasqF1axdXzvMCAJ7c4as8J4kL6xe4mV
imported private key for: EOS5DkoCKtmUahPqrSHkAWwxbSfYjMJAoKA364L8HRwG1WLqA1RGk

# list public keys
cleos --wallet-url http://wallet:5555 wallet keys

# list private keys
cleos --wallet-url http://wallet:5555 wallet private_keys --password PW5KC8VFAHT2bGeNgNDPd4XXfFaCiFCVEEiXzk9GHyNFKFPV1gzAQ

# create a new account
cleos --wallet-url http://wallet:5555 -u http://server:7777 create account eosio mynewaccount {MyNewAccount owner Public Key} {MyNewAccount active Public Key}



```



**ONLY USE FOR TESTING**

eosio public key: `EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV`
 eosio private key: `5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3`

**ONLY USE FOR TESTING**



HELLO WORLD

```shell

```















