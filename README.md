# Coffeechain

## Prerequisites

* Either **Ubuntu 18.04** or **MacOS Darwin 10.12** or higher (other operating systems may work but are untested)
* Docker
* Node.js

with default settings, the dApp, eosio and MySQL will occupy the ports 3306, 4000, 5555 and 7777. Make sure nothing else is running on these ports or change them in the `.env` file.

## Quick Start

### Run the dApp

First, clone the repository and create a `.env` file as shown in `.env.example`:
```shell
git clone https://github.com/leonhfr/coffee-blockchain-backend
cd coffee-blockchain-backend
touch .env
# Atom or your favorite editor:
atom .env
# Copy/paste from .env.example and adjust variables.
# Save the file.
```

Finally run the script `blockchain.sh`.
```shell
sh blockchain.sh
```

The above script will:
* Check that you have Docker and Node.js installed
* Install backend dependencies (`npm install`)
* Pull a MySQL image, start it and populate it with mock data
* Pull a eosio/eos image, configure it, start it and populate it with mock data
* Start the backend API server (`npm start`)

### Troubleshooting
* Docker needs to be able to run [without `sudo`](https://docs.docker.com/install/linux/linux-postinstall/).
* You may need to make the scripts executable. Run this command from the `coffee-blockchain-backend` directory:
```sh
chmod +x blockchain.sh && \
  chmod +x ./blockchain/scripts/mysql.sh && \
  chmod +x ./blockchain/scripts/eosio.sh
```

### Stop the dApp

In the terminal, press `ctrl+c` on your keyboard.

Then execute:
```shell
docker stop eosio_coffeechain && docker stop mysql_coffeechain
```

## Useful stuff

The backend and the frontend are already configured to interact with the blockchain. However, should you wish to interact with it directly, the easiest way is to alias the `docker exec` command to avoid having to enter the Docker containers' bash every time

```shell
# For MySQL:
alias sqlcoffee='docker exec -it mysql_coffeechain mysql -u root --password=[your DB_PASS from .env]'
# For the eosis/eos image:
alias cleos='docker exec -it eosio_coffeechain /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555'
```

Please note that the alias will only be valid within your current terminal. To add it permanently add it to your `~/.bash_profile`.
