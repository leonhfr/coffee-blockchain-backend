# Coffeechain

## Prerequisites

* Docker
* Node.js

The dApp, eosio and MySQL will occupy the ports 3306, 4000, 5555 and 7777. Make sure nothing else is running on these ports.

## Quick Start

### Run the dApp

Clone the repository and run the script `blockchain.sh`.

```shell
git clone https://github.com/leonhfr/coffee-blockchain-backend
cd coffee-blockchain-backend
./blockchain.sh
```

The above script will:
* Check that you have Docker and Node.js installed
* Install backend dependencies (`npm install`)
* Pull a MySQL image, start it and populate it with mock data
* Pull a eosio/eos image, configure it, start it and populate it with mock data
* Start the backend API server (`npm start`)

### Troubleshooting
You may need to make the scripts executable. Run this command from the `coffee-blockchain-backend` directory:
```sh
chmod +x blockchain.sh && \
  chmod +x ./blockchain/scripts/mysql.sh && \
  chmod +x ./blockchain/scripts/eosio.sh
```

### Stop the dApp

In the terminal, press `ctrl+c` on your keyboard.

Then execute:
```shell
docker stop eosiocoffee && docker stop coffeemysql
```

## Useful stuff

The backend and the frontend are already configured to interact with the blockchain. However, should you wish to interact with it directly, the easiest way is to alias the `docker exec` command to avoid having to enter the Docker's container bash every time:

```shell
alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555'
```

Please note that the alias will only be valid within your current terminal. To add it permanently add it to your `~/.bash_profile`.
