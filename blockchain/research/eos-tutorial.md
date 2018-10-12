# Development environment

From the [official documentation](https://developers.eos.io/eosio-home/docs/introduction) at the time of writing.

The purpose of this document is to record what steps worked on my machine, resolve bugs, add notes and serve as a personal cheat sheet.

## Requirements

- **C / C++ experience**, considered as the best language to develop high-speed and highly secure Smart Contracts
- **Command line knowledge**
- One of the following environments:
  - Ubuntu 18.04
  - MacOS Darwin 10.12 and higher (MacOS 10.13.x recommended)
- [Docker](https://www.docker.com/get-started)

## Overview of the tools

![](./assets/nodeos-relations.png)

- `nodeos` (node + eos = nodeos) - the core EOSIO **node** daemon that can be configured with plugins to run a node. Example uses are block production, dedicated API endpoints, and local development. 
- `cleos` (cli + eos = cleos) - command line interface to interact with the blockchain and to manage wallets 
- `keosd` (key + eos = keosd) - component that securely stores EOSIO keys in wallets. 
- `eosio-cpp` - Part of `eosio.cdt`, it compiles C++ code to `WASM` and can generate ABIs

## Development environment

**Important: Remember to change the directories in the following commands.**

### 1. Get the docker image

```shell
docker pull eosio/eos
```

### 2. Boot node and wallet

```shell
docker run --name eosio \
  --publish 7777:7777 \
  --publish 127.0.0.1:5555:5555 \
  --volume /home/leonh/cw/projects/eos-tutos/contracts:/home/leonh/cw/projects/eos-tutos/contracts \
  --detach \
  eosio/eos \
  /bin/bash -c \
  "keosd --http-server-address=0.0.0.0:5555 & exec \ nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::history_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_plugin --plugin eosio::history_api_plugin --plugin eosio::http_plugin -d /mnt/dev/data --config-dir /mnt/dev/config --http-server-address=0.0.0.0:7777 --access-control-allow-origin=* --contracts-console --http-validate-host=false --filter-on='*'"
```

This will do the following:

- Forward ports 7777 and 5555 to the **host (your) machine**
- Alias a work volume on your local drive to the docker container
- Run the Nodeos startup in bash. This command loads all the basic plugins, set the server address, enable CORS and add some contract debugging.

__Important: CORS is enabled for `*` for development purposes only.__

### 3. Check the installation

#### 3.1 Check that Nodeos is producing blocks

This command should produce a log of the blocks produced.

```shell
docker logs --tail 10 eosio
```

#### 3.2 Check the wallet

Open the shell

```shell
docker exec -it eosio bash
```

Run the following command
```shell
cleos --wallet-url http://127.0.0.1:5555 wallet list keys
```

You should see a response
```shell
Wallets:
[]
Error 3120006: No available wallet
Ensure that you have created a wallet and have it open
```

Exit the shell

```
exit
```

#### 3.2 Check Nodeos endpoints

On your **host machine**

```shell
curl http://localhost:7777/v1/chain/get_info
```

### 4. Aliasing Cleos

> We won't want to enter into the Docker container's bash every time we want to interact with Nodeos or Keosd. So let's make cleos a bit easier to use. 

```shell
alias cleos='docker exec -it eosio /opt/eosio/bin/cleos --url http://127.0.0.1:7777 --wallet-url http://127.0.0.1:5555'
```

**Important: the alias is only for the current terminal**

### 5. Useful Docker Tips

```shell
# start/stop container
docker start eosio
docker stop eosio
# bash
docker exec -it nodeos
# remove eosio container
docker rm eosio
```

## Build the contract development toolkit

The local of the following command is not important as it will be compiled as a local binary in later steps.

> The EOSIO Contract Development Toolkit, CDT for short, is a collection of tools related to contract compilation. Subsequent tutorials use the CDT primarily for compiling contracts and generating ABIs.

**Important: many of the following steps take a _long_ time**

### 1. Clone

Clone the `eosio.cdt` repository

```shell
git clone --recursive https://github.com/eosio/eosio.cdt
cd eosio.cdt
```

### 2. Build (up to 30 min)

Here, we also define the **core symbol** as `SYS`

```shell
./build.sh SYS
```

### 3. Install (up to 2h)

```
sudo ./install.sh
```

**Important:**

The `eosio-cpp` command wasn't available (Error `eosio-cpp: command not found`). I tried two different things to make it work, but am unsure of which one solved the problem:

- run the install script a second time
- `cd ./build & sudo make install`

## Create Development Wallet

### 1. Create a wallet

```shell
cleos wallet create --to-console
```

Use `--to-console` for development and `--to-file` for production (otherwise the keys) would be saved in the bash history.

You should see a response

```shell
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5Ke5k7cYTzzwCfunoup4CXD3Td2SZcKutzGhuFZe6dMc4cwy5qc"
```

Save the password for later.

> **About Wallets**
>
> A common misconception in cryptocurrency regarding wallets is that they store tokens. A wallet **does not** store tokens. What a wallet does is store private keys in an encrypted file and sign transactions. 
>
> A user builds a transaction object, usually through an interface,  sends that object to the wallet to be signed, the wallet then returns  that transaction object with a signature which is then broadcast to the  network. When/if the network confirms that the transaction is valid, it  is included into a block on the blockchain.



### 2. Open the wallet

Open the wallet

```shell
cleos wallet open
```

You should see a response

```shell
Opened: default
```

List the wallets

```shell
cleos wallet list
```

You should see a response

```shell
Wallets:
[
  "default *"
]

```

The `*` indicates that the wallet is **unlocked**, it may or may not be there.

### 3. Lock and unlock wallets

**Important: replace the following keys and passwords with your own**

Unlock the wallet

```shell
cleos wallet unlock --password PW5Ke5k7cYTzzwCfunoup4CXD3Td2SZcKutzGhuFZe6dMc4cwy5qc
```

The `--password` option allow us to not have to enter the password. Probably a very bad idea in production environments.

Lock the wallet

```shell
cleos wallet lock
```

### 4. Import keys in the wallet

Generate a private key. `cleos` has a helper function:

```shell
cleos wallet create_key
```

You should see a response

```shell
Created new private key with a public key of: "EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n"
```

This is the **development public key**

### 5. Import the development key

> Every new EOSIO chain has a default "system" user called "eosio". This account is used to setup the chain by loading system contracts that dictate the governance and consensus of the EOSIO chain. Every new EOSIO chain comes with a development key, and this key is the same. On a production chain the `eosio` user is forfeited once the chain is setup. Load this key to sign transactions on behalf of the system user (eosio).

Enter the command below with the **provided private key**

```shell
cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```

**Important: Never use the development key for a production account! Doing so will most certainly result in the loss of access to your account, this private key is publicly known.**

## Create Test Accounts

### What is an account?

> An account is a collection of  authorizations, stored on the blockchain, and used to identify a  sender/recipient. It has a flexible authorization structure that enables  it to be owned either by an individual or group of individuals  depending on **how** permissions have been configured. An account is required to send or receive a valid transaction to the blockchain.
>
> This tutorial series uses two "user" accounts, `bob` and `alice`, as well as the default `eosio` account for configuration. Additionally accounts are made for various contracts throughout this tutorial series.

### Create test accounts

Create the accounts using your own **development public key**

```shell
cleos create account eosio bob EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n 
cleos create account eosio alice EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n
```

You should see a response

```shell
executed transaction: 5362b597b70318caecf69d1106b2193ebaf9afe69ba8280198ec6ce0c3b4146b  200 bytes  203 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"alice","owner":{"threshold":1,"keys":[{"key":"EOS6njG7NDRDxifGNhgMWvk2wni...
warning: transaction executed locally, but may not be confirmed by the network yet    ]
```

**Note:**

If you have an error

```shell
Error 3090003: Provided keys, permissions, and delays do not satisfy declared authorizations
Ensure that you have the related private keys inside your wallet and your wallet is unlocked.
```

Check if you have imported the **provided private key** for the default eosio account.

Also check if your wallet is **unlocked**

> **Using Different Keys for Active/Owner on a PRODUCTION Network**
>
> EOSIO has a unique authorization structure that has added security for you account. You can minimize the exposure  of your account by keeping the owner key cold, while using the key  associated with your `active` permission. This way, if your `active` key were every compromised, you could regain control over your account with your `owner` key.

# Smart Contracts

## Hello world!

### 1. Write the contract

In your contracts folder

```shell
mkdir hello
cd hello
touch hello.cpp
atom hello.cpp
```

In `hello.cpp`

```c++
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;
class hello : public contract {
  public:
    using contract::contract;
    [[eosio::action]]
    void hi( account_name user ) {
       print( "Hello, ", name{user} );
    }
};
EOSIO_ABI( hello, (hi))
```

Explanations:

- [1-2] Includes the required libraries into the file
  - `eosiolib/eosio.hpp` loads the EOSIO C and C++ API into the scope of the contract
- [3] use namespace `eosio` to make things more concise
- [4] create a new class which needs to extend `eosio::contract`
- [5] public access specifier
- [6] using declaration to allow us to write more concise code
- [8-10] action that accepts a "name" parameter and then prints that parameter out
  - The above action accepts a parameter called `user` that's an `account_name` type. EOSIO comes with a number of typedefs, one of the most common typedefs you'll encounter is `account_name`. Using the `eosio::print` library previously included, concatenate a string and print the `user` parameter. Use the braced initialization of `name{user}` to make the `user` parameter printable.
- [7] As is, the abi generator in `eosio.cdt` won't know about the `hi()` action without an attribute. Add a C++11 style attribute above the action, this way the abi generator can produce more reliable output.
- [12] Add the `EOSIO_ABI` macro to handle the dispatching of actions for the `hello` contract.

### 2. Deploy it to the blockchain

Compile the contract to web assembly (`.wasm`)

```shell
eosio-cpp -o hello.wasm hello.cpp --abigen
```

> When a contract is deployed, it is deployed to an account, and the account becomes the interface for the contract. As mentioned earlier these tutorials use the same public key for all of the accounts to keep things more simple.

Create a new account, remember to change the public key to yours

```shell
cleos create account eosio hello EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n -p eosio@active
```

Broadcast the compiled `.wasm` to the blockchain, remember to change the directory to yours

```shell
cleos set contract hello /home/leonh/cw/projects/eos-tutos/contracts/hello -p hello@active
```

The contract is set, let's push an action to it

```shell
cleos push action hello hi '["bob"]' -p bob@active
```

You should see the response

```shell
executed transaction: 2edd235af731828b844d0820317a33a13d044681b407319d7cc2542b430cc294  104 bytes  363 us
#         hello <= hello::hi                    {"user":"bob"}
>> Hello, bob
warning: transaction executed locally, but may not be confirmed by the network yet    ]
```

### 3. Require authentication

As written, the contract will say hi to any user

```shell
cleos push action hello hi '["bob"]' -p alice@active
> Hello, bob
cleos push action hello hi '["alice"]' -p alice@active
> Hello, alice
```

> In this case "alice" is the one who authorized it and `user` is just an argument. Let's modify the contract so that the authorizing user, "alice" in this case, must be the same as the user the contract is responding "hi" to. Use the `require_auth` method. This method takes an `account_name` as a parameter, and will check if the user executing the action matches the provided parameter.

```c++
void hi( account_name user ) {
   require_auth( user );
   print( "Hello, ", name{user} );
}
```

Recompile the contract and update it

```shell
eosio-cpp -o hello.wasm hello.cpp --abigen

cleos set contract hello /home/leonh/cw/projects/eos-tutos/contracts/hello -p hello@active
```

Now if we try providing an `aacount_name` different to the one authorizing the action:

```shell
cleos push action hello hi '["bob"]' -p alice@active
```

The method `require_auth` halted the transaction and threw an error:

```shell
Error 3090004: Missing required authority
Ensure that you have the related authority inside your transaction!;
If you are currently using 'cleos push action' command, try to add the relevant authority using -p option.
```

If we try with `alice`, the transaction is executed:

```shell
cleos push action hello hi '["alice"]' -p alice@active
```

## Deploy, issue and transfer tokens

### 1. Obtain contract source

In your `contracts` directory, pull the source and navigate to the `eosio.token` contracts

```shell
git clone https://github.com/EOSIO/eosio.contracts
cd eosio.contracts/eosio.token
```

### 2. Create an account for the contract

**Important: we're using the eosio development key, use exactly the command line below**

```shell
cleos create account eosio eosio.token EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
```

### 3. Compile the contract

```shell
eosio-cpp -I include -o eosio.token.wasm src/eosio.token.cpp 
```

### 4. Deploy the token contract

```shell
cleos set contract eosio.token /home/leonh/cw/projects/eos-tutos/contracts/eosio.contracts/eosio.token --abi abi/eosio.token.abi -p eosio.token@active
```

Expected result

```shell
eosio.token --abi abi/eosio.token.abi -p eosio.token@active
Reading WASM from /home/leonh/cw/projects/eos-tutos/contracts/eosio.contracts/eosio.token/eosio.token.wasm...
Publishing contract...
executed transaction: cd0225d3181d19ee57a4e7230c8db91b40145b86dd5258885f786b1964ae741c  9320 bytes  1079 us
#         eosio <= eosio::setcode               {"account":"eosio.token","vmtype":0,"vmversion":0,"code":"0061736d0100000001b0011d60037f7e7f0060047f...
#         eosio <= eosio::setabi                {"account":"eosio.token","abi":"0e656f73696f3a3a6162692f312e30010c6163636f756e745f6e616d65046e616d65...
```

### 5. Create the token

> To create a new token call the `create(...)` action with the proper arguments. This action accepts 1 argument, it's a `symbol_name` type composed of two pieces of data, a maximum supply float and a `symbol_name` in capitalized alpha characters only, for example "1.0000 SYS". The issuer will be the one with authority to call issue and or perform other actions such as freezing, recalling, and whitelisting of owners.

The concise way to call this method:

```shell
cleos push action eosio.token create '[ "eosio", "1000000000.0000 SYS"]' -p eosio.token@active
```

Expected result

```shell
executed transaction: b48536a1cab0abb8894ec4043eba01f9e11e4c6298174250dcbe54a7bf26fe07  120 bytes  341 us
#   eosio.token <= eosio.token::create          {"issuer":"eosio","maximum_supply":"1000000000.0000 SYS"}

```

> This command created a new token `SYS` with a precision of 4 decimals and a maximum supply of 1000000000.0000 SYS.  To create this token requires the permission of the `eosio.token` contract. For this reason, `-p eosio.token@active` was passed to authorize the request.

### 6. Issue tokens

Issue tokens to `alice`

```shell
cleos push action eosio.token issue '[ "alice", "100.0000 SYS", "memo" ]' -p eosio@active
```

Expected result

```shell
executed transaction: d4139f0aac3a1fb6f49d25256e94200eabad05ed20b1c8a21c238e1c019c1be9  128 bytes  1243 us
#   eosio.token <= eosio.token::issue           {"to":"alice","quantity":"100.0000 SYS","memo":"memo"}
#   eosio.token <= eosio.token::transfer        {"from":"eosio","to":"alice","quantity":"100.0000 SYS","memo":"memo"}
#         eosio <= eosio.token::transfer        {"from":"eosio","to":"alice","quantity":"100.0000 SYS","memo":"memo"}
#         alice <= eosio.token::transfer        {"from":"eosio","to":"alice","quantity":"100.0000 SYS","memo":"memo"}

```

> This time the output contains several different actions:  one issue and three transfers.  While the only action signed was `issue`, the `issue`  action performed an "inline transfer" and the "inline transfer"  notified the sender and receiver accounts.  The output indicates all of  the action handlers that were called, the order they were called in, and  whether or not any output was generated by the action.
>
> Technically, the `eosio.token` contract could have skipped the `inline transfer` and opted to just modify the balances directly.  However, in this case the `eosio.token`  contract is following our token convention that requires that all  account balances be derivable by the sum of the transfer actions that  reference them.  It also requires that the sender and receiver of funds  be notified so they can automate handling deposits and withdrawals. 
>
> To inspect the transaction, try using the `-d -j` options, they indicate "don't broadcast" and "return transaction as json," which you may find useful during development. 

```shell
cleos push action eosio.token issue '["alice", "100.0000 SYS", "memo"]' -p eosio@active -d -j
```

### 7. Transfer tokens

> Now that account `alice` has been issued tokens, transfer some of them to account `bob`.  It was previously indicated that `alice` authorized this action using the argument `-p alice@active`.

```shell
cleos push action eosio.token transfer '[ "alice", "bob", "25.0000 SYS", "m" ]' -p alice@active
```

Expected output

```shell
executed transaction: 879c384dbc2fc2d66b2605cf71adffdd675ae8ae4ab0be61392b00ea95d1de24  128 bytes  479 us
#   eosio.token <= eosio.token::transfer        {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"m"}
#         alice <= eosio.token::transfer        {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"m"}
#           bob <= eosio.token::transfer        {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"m"}
```

Check if `bob` got his tokens

```shell
cleos get currency balance eosio.token bob SYS
> 25.0000 SYS
cleos get currency balance eosio.token alice SYS
> 75.0000 SYS
```

## Data persistence

**Important: make sure to read the ABI documentation beforehand**

To learn about data persistence, write a simple smart contract that functions as an address book. While this use case isn't very practical as a production smart contract for various reasons, it's a good contract to start with to learn how data persistence works on EOSIO without being distracted by business logic that does not pertain to eosio's `multi_index` functionality.

### 1. Create a directory, create and open a new file

In your contracts folder

```shell
mkdir addressbook
cd addressbook
touch addressbook.cpp
atom addressbook.cpp
```

### 2. Write an Extended Standard Class and include EOSIO

```c++
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
using namespace eosio;

class addressbook : public eosio::contract {
  public:
       
  private: 
  
};
```

### 3. Create the Data Structure for the table

Before a table can be configured and instantiated, a struct that represents the data structure of the address book needs to be written. Think of this as a "schema." Since it's an address book, the table will contain people, so create a `struct` called "person"

```c++
struct person {};
```

When defining the schema for a multi_index table, you will require a unique value to use as the primary key. For this contract, use a field called "key" with type `account_name`. This contract will have one unique entry per user, so this key will be a consistent and guaranteed unique value based on the user's `account_name`

```c++
struct person {
    account_name key;
};
```

Since this contract is an address book it probably should store some relevant details for each entry or *person*

```c++
struct person {
	account_name key;
	string first_name;
	string last_name;
	string street;
	string city;
	string state;
};
```

Great. The basic schema is now complete. Next, define a `primary_key` method, which will be used by `multi_index` iterators. Every multi_index schema requires a primary key. To accomplish this you simply create a method called `primary_key()` and return a value, in this case, the `key` member as defined in the struct.

```c++
struct person {
	account_name key;
	string first_name;
	string last_name;
	string street;
	string city;
	string state;

	uint64_t primary_key() const { return key; }
};
```

> A table's schema cannot be modified while it has data in it. If you need to make changes to a table's schema in any way, you first need to remove all its rows.

### 4. Configure the Multi-Index Table

Now that the schema of the table has been defined with a `struct` we need to configure the table. The [eosio::multi_index](https://developers.eos.io/eosio-cpp/reference#multi-index) constructor needs to be named and configured to use the struct we previously defined.

```c++
typedef eosio::multi_index<N(people), person> address_index;
```

1. Use the [N](https://developers.eos.io/eosio-cpp/reference#n) macro name the table. This table contains a number of different singular "persons", so name the table "people".
2. Pass in the singular `person` struct defined in the previous step
3. Declare this table's type,. This type will be used to instantiate this table later.

With the above `multi_index` configuration there is a multi_index table named **people** that is based on a schema, or data structure of a single row of that table using the struct **person**.

So far, our file should look like this.

```c++
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;

class addressbook : public eosio::contract {

	public:

	private:
		struct [[eosio::table]] person {
            account_name key;
            std::string first_name;
            std::string last_name;
            std::string street;
            std::string city;
            std::string state;

			uint64_t primary_key() const { return key; }
		};

		typedef eosio::multi_index<N(people), person> address_index;
};
```

### 5. The Constructor

When working with C++ classes, the first public method you should create is a constructor.

Our constructor will be responsible for initially setting up the contract.

EOSIO contracts extend the *contract* class. Initialize our parent *contract* class with the scope of the contract. Our `scope` parameter passed by the constructor is the account on the blockchain that the contract is being deployed to.

```c++
addressbook(account_name self): contract(self){}
```

### 6. Adding a record to the table

Previously, the primary key of the multi-index table was defined to enforce that this contract will only store one record per user. To make it all work, some assumptions about the design need to be established.

1. The only account authorized to modify the address book is the user.
2. the **primary_key** of our table is unique, based on username
3. For usability, the contract should have the ability to both create and modify a table row with a single action.

In eosio a chain has unique accounts, so `account_name` is an ideal candidate as a **primary_key** in this specific use case. The [account_name](https://developers.eos.io/eosio-cpp/reference#account_name) type is a `uint64_t`.

Next, define an action for the user to add or update a record. This action will need to accept any values that this action needs to be able to emplace (create) or modify.

Formatted the definition to make it easier to read for now. For user-experience and interface simplicity, have a single method be responsible for both creation and modification of rows. Because of this, name it "upsert," a combination of "update" and "insert."

```c++
void upsert(
    account_name user, 
    std::string first_name, 
    std::string last_name, 
    std::string street, 
    std::string city, 
    std::string state
) {}
```

Earlier, it was mentioned that only the user has control over their own record, as this contract is opt-in. To do this, utilize the [require_auth](https://developers.eos.io/eosio-home/docs/data-persistence) method provided by the `eosio.cdt`. This method accepts one argument, an `account_name` type, and asserts that the account executing the transaction equals the provided value.

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
	require_auth( user );
}
```

Instantiate the table. Previously, a multi_index table was configured, and declared it as `address_index`. To instantiate a table, consider its two required arguments:

1. The "code", which represents the contract's account. This value is accessible through the scoped `_self` variable.
2. The "scope" which defines the payer of the contract, the contract in this use case responsible for paying the ram fee.

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    address_index addresses(_self, _self );
}
```

Next, query the iterator, setting it to a variable since this iterator will be used several times.

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    address_index addresses(_self, _self );
    auto iterator = addresses.find(user);
}
```

Security has been established and table instantiated, great!

Next up, write the logic for creating or modifying the table. Detect whether or not the particular user already exists.

To do this, use table's [find](https://developers.eos.io/eosio-cpp/reference#find) method by passing the `user` parameter. The find method will return an iterator. Use that iterator to test it against the [end](https://developers.eos.io/eosio-cpp/reference#end) method. The "end" method is an alias for "null".

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    auto iterator = addresses.find( user );
    address_index addresses(_self, _self );
    if( addresses.find( user ) == addresses.end() )
    {
    	//The user isn't in the table
    }
    else {
    	//The user is in the table
    }
}
```

Create a record in the table using the multi_index method [emplace](https://developers.eos.io/eosio-cpp/reference#emplace). This method accepts two arguments, the "scope" of this record and a callback function.

The callback function for the emplace method must use a lambda to create a reference. Inside the body assign the row's values with the ones provided to `upsert`.

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    auto iterator = addresses.find( user );
    address_index addresses(_self, _self );
    if( addresses.find( user ) == addresses.end() )
    {
        addresses.emplace(user, [&]( auto& row ) {
            row.key = user;
            row.first_name = first_name;
            row.last_name = last_name;
            row.street = street;
            row.city = city;
            row.state = state;
        });
    }
    else {
    	//The user is in the table
    }
}
```

Next, handle the modification, or update, case of the "upsert" function. Use the [modify](https://developers.eos.io/eosio-cpp/reference#modify) method, passing a few arguments

- The iterator defined earlier, present set to the user as declared when calling this action.
- The "scope" or "ram payer", which in this case is the user, as previously decided when proposing the design for this contract.
- The callback function to handle the modification of the table.

```c++
void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    auto iterator = addresses.find( user );
    address_index addresses(_self, _self );
    if( addresses.find( user ) == addresses.end() )
    {
        addresses.emplace(user, [&]( auto& row ) {
            row.key = user;
            row.first_name = first_name;
            row.last_name = last_name;
            row.street = street;
            row.city = city;
            row.state = state;
        });
    }
    else {
        addresses.modify(iterator, user, [&]( auto& row ) {
            row.first_name = first_name;
            row.last_name = last_name;
            row.street = street;
            row.city = city;
            row.state = state;
        });
    }
}
```

The `addressbook` contract now has a functional action that will enable a user to create a row in the table if that record does not yet exist, and modify it if it already exists.

But what if the user wants to remove the record entirely?

### 7. Remove a record from the table

Similar to the previous steps, create a public method in the `addressbook`, making sure to include the ABI declarations and a [require_auth](https://developers.eos.io/eosio-cpp/reference#require_auth) that tests against the action's argument `user`to verify only the owner of a record can modify their account.

```c++
    void erase(account_name user){
      require_auth(user);
    }
```

Instantiate the table. In `addressbook` each account has only one record. Set `iterator` with [find](https://developers.eos.io/eosio-cpp/reference#find)

```c++
...
    void erase(account_name user){
      require_auth(user);
      address_index addresses(_self, _self);
      auto iterator = addresses.find(user);
    }
...
```

A contract *cannot* erase a record that doesn't exist, so assert that the record indeed exists before proceeding.

```c++
...
    void erase(account_name user){
      require_auth(user);
      address_index addresses(_self, _self);
      auto iterator = addresses.find( user );
      eosio_assert(iterator != addresses.end(), "Record does not exist");
    }
...
```

Finally, call the [erase](https://developers.eos.io/eosio-cpp/reference#erase) method, to erase the iterator.

```c++
...
    void erase(account_name user){
      require_auth(user);
      address_index addresses(_self, _self);
      auto iterator = addresses.find( user );
      eosio_assert(iterator != addresses.end(), "Record does not exist");
      addresses.erase(iterator);
    }
...
```

The contract is now mostly complete. Users can create, modify and erase records. However, the contract is not quite ready to be compiled.

### 8. Preparing for the ABI

Complete the following steps to complete the contract.

#### 8.1 EOSIO_ABI

At the bottom of the file, utilize the [EOSIO_ABI](https://developers.eos.io/eosio-home/docs/data-persistence) macro, passing the name of the contract, and our lone action "upsert".

This macro handles the apply handlers used by wasm to dispatch calls to specific methods in our contract.

Adding the following to the bottom of `addressbook.cpp` will make our `cpp` file compatible with EOSIO's wasm interpreter. Failing to include this declaration may result in an error when deploying the contract.

```c++
EOSIO_ABI( addressbook, (upsert) )
```

#### 8.2 ABI Action declarations

[eosio.cdt](https://developers.eos.io/eosio-home/docs/data-persistence) includes an ABI Generator, but for it to work will require some minor declarations to our contract.

Above both the `upsert` and `erase` functions add the following C++11 declaration

```c++
[[eosio::action]]
```

The above declaration will extract the arguemnts of the action and create necessary ABI *struct*descriptions in the generated ABI file.

#### 8.3 ABI Table declarations

Add an ABI declaration to the table. Modify the following line defined in the private region of your contract:

```c++
struct person {
```

To this:

```c++
struct [[eosio::table]] person {
```

The `[[eosio.table]]` declaration will add the necessary descriptions to the ABI file.

Now our contract is ready to be compiled.

Below is the final state of our `addressbook` contract:

```c++
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;

class addressbook : public eosio::contract {

public:
  using contract::contract;

  addressbook(account_name self): contract(self) {}

  [[eosio::action]]
  void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    address_index addresses(_self, _self);
    auto iterator = addresses.find( user );
    if( iterator == addresses.end() )
    {
      addresses.emplace(user, [&]( auto& row ) {
       row.key = user;
       row.first_name = first_name;
       row.last_name = last_name;
       row.street = street;
       row.city = city;
       row.state = state;
      });
    }
    else {
      std::string changes;
      addresses.modify(iterator, user, [&]( auto& row ) {
        row.key = user;
        row.first_name = first_name;
        row.last_name = last_name;
        row.street = street;
        row.city = city;
        row.state = state;
      });
    }
  }

  [[eosio::action]]
  void erase(account_name user){
    // require_auth(user);
    address_index addresses(_self, _self);
    auto iterator = addresses.find( user );
    eosio_assert(iterator != addresses.end(), "Record does not exist");
    addresses.erase(iterator);
  }

private:
  struct [[eosio::table]] person {
    account_name key;
    std::string first_name;
    std::string last_name;
    std::string street;
    std::string city;
    std::string state;
    uint64_t primary_key() const { return key; }
  };
  typedef eosio::multi_index<N(people), person> address_index;

};

EOSIO_ABI( addressbook, (upsert)(erase) )
```

### 9. Compile and deploy the contract

```shell
# compiling
eosio-cpp -o addressbook.wasm addressbook.cpp --abigen
# new account
cleos create account eosio addressbook EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n -p eosio@active
# deploying the contract
cleos set contract addressbook /home/leonh/cw/projects/eos-tutos/contracts/addressbook -p addressbook@active
```

### 10. Test the contract

Add a row to the table

```shell
cleos push action addressbook upsert '["alice", "alice", "liddell", "123 drink me way", "wonderland", "amsterdam"]' -p alice@active
```

Expected result

```shell
executed transaction: 2e988a81197e1bff93518d4e05323870e914f46b301bfb272ffc7a308bf38e5e  152 bytes  594 us
#   addressbook <= addressbook::upsert          {"user":"alice","first_name":"alice","last_name":"liddell","street":"123 drink me way","city":"wonde...
```

Check that `alice` cannot add records for another user

```shell
cleos push action addressbook upsert '["bob", "bob", "is a loser", "doesnt exist", "somewhere", "someplace"]' -p alice@active
```

Expected result

```shell
Error 3090004: Missing required authority
Ensure that you have the related authority inside your transaction!;
If you are currently using 'cleos push action' command, try to add the relevant authority using -p option.
```

Retrieve `alice`'s record

```shell
cleos get table addressbook addressbook people -k alice
```

Expected result

```shell
{
  "rows": [{
      "key": "alice",
      "first_name": "alice",
      "last_name": "liddell",
      "street": "123 drink me way",
      "city": "wonderland",
      "state": "amsterdam"
    }
  ],
  "more": false
}
```

Delete `alice`'s record

```shell
cleos push action addressbook erase '["alice"]' -p alice@active
```

Expected result

```shell
executed transaction: 5d5015cd1000a8a94317c7dba0072683c4ebe759a203913bc95aeb4bed2be7b6  104 bytes  488 us
#   addressbook <= addressbook::erase           {"user":"alice"}
```

Check that the record was removed

```shell
cleos get table addressbook addressbook people -k alice
```

Expected result

```shell
{
  "rows": [],
  "more": false
}

```

## Adding inline actions

### 1. Adding eosio.code to `addressbook`'s account

In order for the inline actions to be sent from `addressbook`, add the `eosio.code` permission to the contract's account's active permission. Open your terminal and run the following code

```shell
cleos set account permission addressbook active '{"threshold": 1,"keys": [{"key": "EOS6njG7NDRDxifGNhgMWvk2wnicC3tY4einedypq7TUsioDB8w4n","weight": 1}], "accounts": [{"permission":{"actor":"addressbook","permission":"eosio.code"},"weight":1}]}' -p addressbook@owner
```

Expected result

```shell
executed transaction: 0c580a4dc0822e963136af6f9e655bc5798c831f005847dd3a735bc514bef632  184 bytes  281 us
#         eosio <= eosio::updateauth            {"account":"addressbook","permission":"active","parent":"owner","auth":{"threshold":1,"keys":[{"key"...
```

The `eosio.code` authority is a pseudo authority implemented to enhance security, and enable contracts to execute inline actions.

### 2. Notify action

If not still opened, open the `addressbook.cpp` contract authored in the last tutorial. Write an action that will behave as a "transaction receipt". To do this, create a *private* helper function in the `addressbook` class.

```c++
  [[eosio::action]]
  void notify(account_name user, std::string msg) {}
```

This function is very simple, it just accepts an `account_name` and a `string`.

### 3. Copy action to sender using require_recipient

This transaction needs to be copied to the user so it can be considered a reciept. To do this, use the [require_recipient](https://developers.eos.io/eosio-cpp/reference#require_recipient) method.

```c++
  [[eosio::action]]
  void notify(account_name user, std::string msg) {
   require_recipient(user);
  }
```

This action is very simple, it will copy the given action to the provided user. However, as written, it anybody could call this function, and "fake" a receipt from this contract. This could be use in malicious ways, and should be seen as a vulnerability. To correct this, require that the authorities provided in the call to this action is from the contract, for this, use [get_self](https://developers.eos.io/eosio-cpp/v1.3.0/reference#get_self)

```c++
  [[eosio::action]]
  void notify(account_name user, std::string msg) {
    require_auth(get_self());
    require_recipient(user);
  }
```

Now if user `bob` calls this function directly, but passes the parameter `alice` the action will throw an exception.

### 4. Notify helper for sending inline transaction

Since this inline action will be called several times, write a quick helper for maximum code reuse. In the private region of your contract, define a new method.

```c++
...
	private: 
  	void send_summary(account_name user, std::string message){}
```

Inside of this helper construct an action and send it.

### 5. The action constructor

Modify the `addressbook` contract to send a receipt to the user every time they have taken an action on the contract.

To begin, address the "create record" case. This is the case that fires when a record is not found in the table, when `iterator == addresses.end()` is `true`

Save this object to an `action` variable called `notification`

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action(
        //permission_level,
        //code,
        //action,
        //data
      );   
    }
```

The action constructor requires a number of parameters.

- A [permission_level](https://developers.eos.io/eosio-cpp/reference#structeosio_1_1permission__level) struct
- The contract to call (converted using `N()` macro)
- The action (converted using `N()` macro)
- The data to pass to the action, a tuple of positionals that correlate to the actions being called.

#### 5. 1 The permission struct

In this contract the permission should be authorized by the `active` authority of the contract using `get_self()`. As a reminder, to use the 'active`authority inline you will need your contract's to give active authority to`eosio.code` pseudo-authority (instructions above)

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action(
        permission_level{get_self(),N(active)},
      );
    }
```

#### 5.2 The "code" aka "account where contract is deployed"

Since the action called is in this contract, use [get_self](https://developers.eos.io/eosio-cpp/v1.3.0/reference#get_self). `N(addressbook)` would also work here, but if this contract were deployed under a different account name, it wouldn't work. Because of this, `get_self()` is the superior option.

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action notification = action(
        permission_level{get_self(),N(active)},
        get_self(),
        //action
        //data
      );
    }
```

#### 5.3 The action

The `notify` action was previously defined to be called from this inline action. Use the `N()`macro here.

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action(
        permission_level{get_self(),N(active)},
        get_self(),
        N(notify),
        //data
      );
    }
```

#### 5.4 The data

Finally, define the data to pass to this action. The notify function accepts two parameters, an `account_name` and a `string`. The action constructor expects data as type `bytes`, so use `make_tuple`, a function available through `std` C++ library. Data passed in the tuple is positional, and determined by the order of the parameters accepted by the action that being called.

- Pass the `user` variable that is provided as a parameter of the `upsert()` action.
- Concatenate a string that includes the name of the user, and include the `message` to pass to the `notify` action.

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action(
        permission_level{get_self(),N(active)},
        get_self(),
        N(notify),
        std::make_tuple(user, name{user}.to_string() + message)
      );
    }
```

#### 5.5 Send the action

Finally, send the action using the `send` method of the action struct.

```c++
...
  private: 
    void send_summary(account_name user, std::string message){
      action(
        permission_level{get_self(),N(active)},
        get_self(),
        N(notify),
        std::make_tuple(user, name{user}.to_string() + msg)
      ).send();
    }
```

### 6. Call the helper and inject relevant messages

Now that the helper is defined, it should probably be called from the relevant locations. There's three specific places for the new `notify` helper to be called from:

- After the contract `emplaces` a new record: `send_summary(user, "successfully emplaced record to addressbook");`
- After the contract `modifies` an existing record: `send_summary(user, "successfully modified record in addressbook.")`
- After the contract `erases` an existing record: `send_summary(user, "successfully erased record from addressbook");`

### 7. Updating the EOSIO_ABI macro

The new action `notify` has been added to the contract, so update the `EOSIO_ABI` macro at the bottom of the file to include the new `notify` action. This ensures that the `notify` action is not scrubbed by `eosio.cdt`'s optimizer.

```c++
  EOSIO_ABI( addressbook, (upsert)(erase)(notify) )
```

Now that everything is in place, here's the current state of the `addressbook` contract:

```c++
#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>

using namespace eosio;

class addressbook : public eosio::contract {

public:
  using contract::contract;

  addressbook(account_name self): contract(self) {}

  [[eosio::action]]
  void upsert(account_name user, std::string first_name, std::string last_name, std::string street, std::string city, std::string state) {
    require_auth( user );
    address_index addresses(_self, _self);
    auto iterator = addresses.find( user );
    if( iterator == addresses.end() )
    {
      addresses.emplace(user, [&]( auto& row ) {
       row.key = user;
       row.first_name = first_name;
       row.last_name = last_name;
       row.street = street;
       row.city = city;
       row.state = state;
      });
      send_summary(user, "successfully emplaced record to addressbook");
    }
    else {
      std::string changes;
      addresses.modify(iterator, user, [&]( auto& row ) {
        row.key = user;
        row.first_name = first_name;
        row.last_name = last_name;
        row.street = street;
        row.city = city;
        row.state = state;
      });
      send_summary(user, "successfully modified record in addressbook.");
    }
  }

  [[eosio::action]]
  void erase(account_name user){
    // require_auth(user);
    address_index addresses(_self, _self);
    auto iterator = addresses.find( user );
    eosio_assert(iterator != addresses.end(), "Record does not exist");
    addresses.erase(iterator);
    send_summary(user, "successfully erased record from addressbook");
  }

  [[eosio::action]]
  void notify(account_name user, std::string msg) {
    require_auth(get_self());
    require_recipient(user);
  }

private:
  struct [[eosio::table]] person {
    account_name key;
    std::string first_name;
    std::string last_name;
    std::string street;
    std::string city;
    std::string state;
    uint64_t primary_key() const { return key; }
  };
  typedef eosio::multi_index<N(people), person> address_index;

  void send_summary(account_name user, std::string message){
    action(
      permission_level{get_self(),N(active)},
      get_self(),
      N(notify),
      std::make_tuple(user, name{user}.to_string() + " " + message)
    ).send();
  }

};

EOSIO_ABI( addressbook, (upsert)(notify)(erase) )
```

### 8. Recompile and regenerate the ABI file

```shell
# compiling
eosio-cpp -o addressbook.wasm addressbook.cpp --abigen
# deploying the contract
cleos set contract addressbook /home/leonh/cw/projects/eos-tutos/contracts/addressbook -p addressbook@active
```

Expected response

```shell
Reading WASM from /home/leonh/cw/projects/eos-tutos/contracts/addressbook/addressbook.wasm...
Publishing contract...
executed transaction: 4b99725a374ec19bcb13054d8a67dc43f2515c4e1e54ffe991478f2fa330407f  7280 bytes  1190 us
#         eosio <= eosio::setcode               {"account":"addressbook","vmtype":0,"vmversion":0,"code":"0061736d0100000001a5011a60027f7e0060037f7e...
#         eosio <= eosio::setabi                {"account":"addressbook","abi":"0e656f73696f3a3a6162692f312e30000405657261736500010475736572046e616d...

```

### 9. Testing it

Now that the contract has been modified and deployed, test it. In the previous tutorial, alice's addressbook record was deleted during the testing steps, so calling `upsert` will fire the inline action just written inside of the "create" case.

```shell
cleos push action addressbook upsert '["alice", "alice", "liddell", "123 drink me way", "wonderland", "amsterdam"]' -p alice@active
```

`cleos` will return some data, that includes all the actions executed in the transaction

```shell
executed transaction: dcc17aea2a941ae1da205738882387c2fa0b540850f8bea97ebdef147f859351  152 bytes  810 us
#   addressbook <= addressbook::upsert          {"user":"alice","first_name":"alice","last_name":"liddell","street":"123 drink me way","city":"wonde...
#   addressbook <= addressbook::notify          {"user":"alice","msg":"alice successfully emplaced record to addressbook"}
#         alice <= addressbook::notify          {"user":"alice","msg":"alice successfully emplaced record to addressbook"}
```

At the bottom you'll notice that `addressbook::notify` copied `alice` with some information about this transaction. Use [cleos get actions](https://developers.eos.io/eosio-cleos/reference#cleos-get-transactions) to show us actions executed and relevant to alice.

```shell
cleos get actions alice
```

Expected response

```shell
#  seq  when                              contract::action => receiver      trx id...   args
================================================================================================================
#    0   2018-10-09T13:59:28.500                 hello::hi => hello         2591d679... {"user":"bob"}...
#    1   2018-10-09T13:59:38.500                 hello::hi => hello         d720207e... {"user":"alice"}...
#    2   2018-10-09T14:06:51.000                 hello::hi => hello         6646767b... {"user":"alice"}...
#    3   2018-10-09T14:25:42.000     eosio.token::transfer => alice         d4139f0a... {"from":"eosio","to":"alice","quantity":"100.0000 SYS","memo...
#    4   2018-10-09T14:29:51.000     eosio.token::transfer => eosio.token   879c384d... {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"...
#    5   2018-10-09T14:29:51.000     eosio.token::transfer => alice         879c384d... {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"...
#    6   2018-10-09T14:29:51.000     eosio.token::transfer => bob           879c384d... {"from":"alice","to":"bob","quantity":"25.0000 SYS","memo":"...
#    7   2018-10-09T18:53:44.500       addressbook::upsert => addressbook   2e988a81... {"user":"alice","first_name":"alice","last_name":"liddell","...
#    8   2018-10-09T18:58:32.000        addressbook::erase => addressbook   5d5015cd... {"user":"alice"}...
#    9   2018-10-10T08:13:53.000       addressbook::upsert => addressbook   dcc17aea... {"user":"alice","first_name":"alice","last_name":"liddell","...
#   10   2018-10-10T08:13:53.000       addressbook::notify => alice         dcc17aea... {"user":"alice","msg":"alice successfully emplaced record to...
```

## Inline actions to external contract

### 1. Writing an `addressbook` counter contract



### 2. Create account for `abcounter` contract



### 3. Compile and deploy



### 4. Modify `addressbook` contract to send inline-action to `abcounter`



### 5. Recompile and redeploy the `addressbook` contract



### 6. Test it



### 7. Extra credit: more verbose receipts



## Custom dispatchers

https://developers.eos.io/eosio-home/docs/writing-a-custom-dispatcher





