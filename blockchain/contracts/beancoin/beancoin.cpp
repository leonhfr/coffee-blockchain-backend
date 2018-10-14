#include "beancoin.hpp"

namespace CoffeeBlockchain {

  // PUBLIC METHODS

  void Beancoin::notify(
    account_name user,
    string message
  ) {
    require_auth(get_self());
    require_recipient(user);
  }

  // USER

  void Beancoin::upsertuser(
    account_name user,
    string role,
    string hash
  ) {
    require_auth(user); // ONLY THE USER CAN REGISTER OR MODIFY ITSELF
    user_index users(_self, _self);
    auto iterator = users.find(user);
    if (iterator == users.end()) {
      users.emplace(user, [&](auto& row) {
        row.username = user;
        row.role = role;
        row.hash = hash;
      });
      print("Inserted user!");
    } else {
      users.modify(iterator, user, [&](auto& row) {
        row.username = user;
        row.role = role;
        row.hash = hash;
      });
      print("Updated user!");
    }
    print(" | username: ", name{user});
    print(" | role: ", role);
    print(" | hash: ", hash);
  }

  void Beancoin::deluser(
    account_name user
  ) {
    require_auth(user); // ONLY THE USER CAN DELETE ITSELF
    user_index users(_self, _self);
    auto iterator = users.find(user);
    // THROW AN ERROR IF THE USER IS NOT REGISTERED
    eosio_assert(iterator != users.end(), "User does not exist.");
    users.erase(iterator);
    print("Deleted user ", name{user}, ".");
  }

  void Beancoin::getuser(
    account_name user
  ) {
    // EVERYONE CAN QUERY THE BLOCKCHAIN TO CHECK THE HASHES
    user_index users(_self, _self);
    auto iterator = users.find(user);
    // THROW AN ERROR IF THE USER IS NOT REGISTERED
    eosio_assert(iterator != users.end(), "User does not exist.");
    auto queriedUser = users.get(user);
    print("Get user.");
    print(" | username: ", name{user});
    print(" | role: ", queriedUser.role);
    print(" | hash: ", queriedUser.hash);
  }

  // COFFEE

  void Beancoin::upsertcoffee(
    account_name owner,
    uint64_t uuid,
    string hash,
    int64_t price,
    int64_t quantity
  ) {
    require_auth(owner); // ONLY THE OWNER CAN ADD COFFEE TO SALE
    coffee_index coffees(_self, _self);
    auto iterator = coffees.find(uuid);
    if (iterator == coffees.end()) {
      coffees.emplace(owner, [&](auto& row) {
        row.uuid = uuid;
        row.owner = owner;
        row.hash = hash;
        row.price = price;
        row.quantity = quantity;
      });
      print("Inserted coffee!");
    } else {
      auto queriedCoffee = coffees.get(uuid);
      if (queriedCoffee.owner == owner) {
        coffees.modify(iterator, owner, [&](auto& row) {
          row.uuid = uuid;
          row.owner = owner;
          row.hash = hash;
          row.price = price;
          row.quantity = quantity;
        });
        print("Updated coffee!");
      } else {
        print("Unauthorized coffee upsert prevented.");
      }
    }
    print(" | uuid: ", uuid);
    print(" | owner: ", name{owner});
    print(" | hash: ", hash);
    print(" | price: ", price);
    print(" | quantity: ", quantity);
  }

  void Beancoin::delcoffee(
    account_name owner,
    uint64_t uuid
  ) {
    require_auth(owner);
    coffee_index coffees(_self, _self);
    auto iterator = coffees.find(uuid);
    eosio_assert(iterator != coffees.end(), "Coffee does not exist.");
    auto queriedCoffee = coffees.get(uuid);
    if (queriedCoffee.owner == owner) {
      coffees.erase(iterator);
      print("Deleted coffee!");
      print(" | uuid: ", uuid);
      print(" | owner: ", name{owner});
    } else {
      print("Unauthorized coffee deletion prevented.");
    }
  }

  void Beancoin::getcoffee(
    uint64_t uuid
  ) {
    coffee_index coffees(_self, _self);
    auto iterator = coffees.find(uuid);
    eosio_assert(iterator != coffees.end(), "Coffee does not exist.");
    auto queriedCoffee = coffees.get(uuid);
    print("Get coffee.");
    print(" | uuid: ", queriedCoffee.uuid);
    print(" | owner: ", name{queriedCoffee.owner});
    print(" | hash: ", queriedCoffee.hash);
    print(" | price: ", queriedCoffee.price);
    print(" | quantity: ", queriedCoffee.quantity);
    send_data(_self, queriedCoffee.hash);
  }

  // SALE

  void Beancoin::initiatesale(
    uint64_t uuid,
    uint64_t uuid_coffee,
    account_name buyer,
    uint64_t quantity
  ) {
    require_auth(buyer); // ONLY BUYERS CAN INITIATE TRANSACTIONS
    coffee_index coffees(_self, _self);
    auto iterator = coffees.find(uuid_coffee);
    eosio_assert(iterator != coffees.end(), "Coffee does not exist.");
    auto queriedCoffee = coffees.get(uuid_coffee);
    sale_index sales(_self, _self);
    if (queriedCoffee.quantity >= quantity) {
      sales.emplace(buyer, [&](auto& row) {
        row.uuid = uuid;
        row.uuid_coffee = uuid_coffee;
        row.seller = queriedCoffee.owner;
        row.buyer = buyer;
        row.quantity = quantity;
        row.status = "init";
      });
      coffees.modify(iterator, queriedCoffee.owner, [&](auto& row) {
        row.quantity -= quantity;
      });
      print("Initiate sale.");
      print(" | uuid: ", uuid);
      print(" | uuid_coffee: ", uuid_coffee);
      print(" | buyer: ", name{buyer});
      print(" | seller: ", name{queriedCoffee.owner});
      print(" | quantity: ", quantity);
    } else {
      print("Not enough coffee stock to honor the sale.");
    }
  }

  void Beancoin::getsale(
    uint64_t uuid
  ) {
    sale_index sales(_self, _self);
    auto iterator = sales.find(uuid);
    eosio_assert(iterator != sales.end(), "Sales does not exist.");
    auto queriedSale = sales.get(uuid);
    print("Get sale.");
    print(" | uuid: ", uuid);
    print(" | uuid_coffee: ", queriedSale.uuid_coffee);
    print(" | buyer: ", name{queriedSale.buyer});
    print(" | seller: ", name{queriedSale.seller});
    print(" | quantity: ", queriedSale.quantity);
    print(" | status: ", queriedSale.status);
    send_data(_self, queriedSale.status);
  }

  void Beancoin::fulfillsale(
    uint64_t uuid
  ) {
    require_auth(_self); // ONLY BEANCOIN :p
    sale_index sales(_self, _self);
    auto iterator = sales.find(uuid);
    eosio_assert(iterator != sales.end(), "Sales does not exist.");
    auto queriedSale = sales.get(uuid);
    sales.modify(iterator, queriedSale.buyer, [&](auto& row) {
      row.status = "fulfilled";
    });
    print("Fulfill sale.");
    print(" | uuid: ", uuid);
    print(" | uuid_coffee: ", queriedSale.uuid_coffee);
    print(" | buyer: ", name{queriedSale.buyer});
    print(" | seller: ", name{queriedSale.seller});
    print(" | quantity: ", queriedSale.quantity);
    print(" | status: ", queriedSale.status);
    send_data(_self, queriedSale.status);
  }

  // PRIVATE METHODS

  void Beancoin::send_data(
    account_name user,
    string data
  ) {
    action(
      permission_level{get_self(), N(active)},
      get_self(),
      N(notify),
      std::make_tuple(user, name{user}.to_string() + " " + data)
    ).send();
  }
}
