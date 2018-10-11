# EOS Notes

## The ultimate guide end to end EOS dApp development tutorial

### Players smart contract

An important thing you should know when developing EOS dApps is that the smart contracts communicate with each other in the form of actions and shared memory database access. A contract can read the state of another contract’s database as long as it is included within the read scope of the transaction with an async vibe. This can be achieved by using one of two communication modes — **inline** or **deferred**. You can think of them as **sync** & **async**

*From the EOS.IO documentation:*

- **Inline** — Inline is guaranteed to execute with the current transaction or unwind; no notification will be communicated regardless of success or failure. Inline operates with the same scopes and authorities the original transaction had
- **Deferred** — Defer will get scheduled later at producer’s discretion; it’s possible to communicate the result of the communication or can simply timeout. Deferred can reach out to different scopes and carry the authority of the contract that sends them.

In the class body of our contract, there are two types of access modifiers — public & private. In the public section are the constructor and all actions. An action represents a single operation inside the smart contract. In our contract, we have **add**, **update** & **getplayer**. We’ll take a look at them in a while. In meantime, you should have already noticed that before each action we have “**//@abi action**“. It’s an indication flag for the **eosiocpp** script which will generate the **.abi** file for our smart contract.

In the private section, we keep everything which we don’t want to be accessible from outside the **Players** contract. Here we’re initializing the multi_index. What is it and why we need it?

> ...

#### multi_index

As we said an action represents a single operation inside the smart contract. Each action operates within its own environment known as the action context. The context provides several things necessary for the execution of the action. One of those things is the action’s working memory. This is where the action maintains its working state. Before processing an action, EOSIO sets up a clean working memory for the action. Variables that might have been set when another action executed are not available within the new action’s context. The only way to pass state among actions is to persist it to and retrieve it from the EOSIO database.This can be achieved with the multi-index which allow us to read and modify persistent state in the EOSIO database.

In our contract, we have declared an object template for the multi-index table called **player**. It’s important to note that as we’re creating a template for the table we need to add a primary_key too. We use the account_name as we want one player per account.

We also have an indication flag for the **eosiocpp** script — “**//@abi table player i64**“. We are saying that the name of our table is **player** and the used index type is **i64**.

Once the object is ready we need to typedef our multi-index with the following template:

#### EOSIO_SERIALIZE and EOSIO_ABI

These are C++ macros. **EOSIO_ABI** encapsulate the logic of the **apply**method. **apply** is the action handler, it listens to all incoming actions and reacts according to the specifications within the function. The structure of the macro is really simple. The first parameter is the type (name of the current class) and next parameters are all actions listed as in the example below

The **EOSLIB_SERIALIZE** macro provides serialize and deserialize methods so that actions can be passed back and forth between the contracts and the nodeos system.

### Actions implementations

### Update and extend players contract

If you remember in the previous tutorial we have created two files – **Players.hpp** & **Players.cpp**, which are our **header(.hpp)** and **implementation(.cpp)** files. Almost all of the code we have written was inside the Players.cpp and only a few imports in the Players.hpp. We’re going to make small changes on that for two reasons.

1. First, the header file is responsible for the declaration of all variables, constants, and actions referenced by the .cpp file. It’s pretty much like an interface. On the other hand, the implementation files hold the implementation of all actions.
2. The second reason to update our contract it’s based on C++ and programming conventions. When you want to use one contract in another you should import it. However, the best way to do that is to import the **.hpp** file as the contract who will use it doesn’t need to know what the implementation is or in other words we shouldn’t import the **.cpp** file. It’s a bad practice.

> Header files (.hpp) allow you to make the **interface** (in this case, the class Players) visible to other .cpp files, while keeping the **implementation** (in this case, Players’ action bodies) in its own .cpp file. The #include statement is basically like a copy/paste operation. The compiler will “replace” the #include line with the actual contents of the file you’re including when it compiles the file.

