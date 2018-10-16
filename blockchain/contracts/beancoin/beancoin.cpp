#include "beancoin.hpp"

namespace CoffeeBlockchain {

  // COMMAND TO COMPILE THE CONTRACT
  // eosio-cpp -o beancoin.wasm beancoin.cpp --abigen

  // PUBLIC METHODS

  void Beancoin::notify(
    account_name user,
    string message
  ) {
    require_auth(get_self());
    require_recipient(user);
  }

  // PUBLIC: USER

  void Beancoin::upsertuser(
    account_name user,
    string role,
    string hash
  ) {
    require_auth(user); // ONLY THE USER CAN REGISTER OR MODIFY ITSELF
    user_index users(_self, _self);
    auto iterator = users.find(user);
    if (iterator == users.end()) {
      users.emplace(_self, [&](auto& row) {
        row.username = user;
        row.role = role;
        row.hash = hash;
      });
    } else {
      users.modify(iterator, _self, [&](auto& row) {
        row.username = user;
        row.role = role;
        row.hash = hash;
      });
    }
    print("{\"action\":\"upsertuser\",");
    print("\"user\":\"", name{user});
    print("\",\"role\":\"", role);
    print("\",\"hash\":\"", hash);
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
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

    print("{\"action\":\"deluser\",");
    print("\"user\":\"", name{user});
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
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

    print("{\"action\":\"getuser\",");
    print("\"user\":\"", name{user});
    print("\",\"role\":\"", queriedUser.role);
    print("\",\"hash\":\"", queriedUser.hash);
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
  }

  // PUBLIC: COFFEE

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
      coffees.emplace(_self, [&](auto& row) {
        row.uuid = uuid;
        row.owner = owner;
        row.hash = hash;
        row.price = price;
        row.quantity = quantity;
      });
    } else {
      auto queriedCoffee = coffees.get(uuid);
      if (queriedCoffee.owner == owner) {
        coffees.modify(iterator, _self, [&](auto& row) {
          row.uuid = uuid;
          row.owner = owner;
          row.hash = hash;
          row.price = price;
          row.quantity = quantity;
        });
      } else {
        print("Unauthorized coffee upsert prevented.");
      }
    }

    print("{\"action\":\"getcoffee\",");
    print("\"uuid\":", uuid);
    print(",\"owner\":\"", name{owner});
    print("\",\"hash\":\"", hash);
    print("\",\"price\":", price);
    print(",\"quantity\":", quantity);
    print("}");
    // {"action":"","user":"","role":"","hash":""}
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

      print("{\"action\":\"delcoffee\",");
      print("\"owner\":\"", name{owner});
      print("\",\"uuid\":", uuid);
      print("}");
      // {"action":"","user":"","role":"","hash":""}
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

    // TODO: some more data for coffee maybe
    print("{\"action\":\"upsertuser\",");
    print("\"owner\":\"", name{queriedCoffee.owner});
    print("\",\"hash\":\"", queriedCoffee.hash);
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
    send_data(_self, queriedCoffee.hash);
  }

  // PUBLIC: SALE

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
    uint64_t price = queriedCoffee.price;
    uint64_t total = price * quantity;
    sale_index sales(_self, _self);
    if (queriedCoffee.quantity >= quantity) {
      sales.emplace(_self, [&](auto& row) {
        row.uuid = uuid;
        row.uuid_coffee = uuid_coffee;
        row.seller = queriedCoffee.owner;
        row.buyer = buyer;
        row.quantity = quantity;
        row.price = price;
        row.total = total;
        row.status = "1";
      });
      print("{\"action\":\"initiatesale\",");
      print("\"uuid\":", uuid);
      print(",\"role\":", uuid_coffee);
      print(",\"seller\":\"", name{queriedCoffee.owner});
      print("\",\"buyer\":\"", name{buyer});
      print("\",\"quantity\":", quantity);
      print(",\"price\":", price);
      print(",\"total\":", total);
      print(",\"status\":", 1);
      print("}");
      // {"action":"","user":"","role":"","hash":""}
    } else {
      print("Not enough coffee stock to honor the sale.");
    }
  }

  void Beancoin::getsale(
    uint64_t uuid
  ) {
    sale_index sales(_self, _self);
    auto iterator = sales.find(uuid);
    eosio_assert(iterator != sales.end(), "Sale does not exist.");
    auto queriedSale = sales.get(uuid);

    print("{\"action\":\"getsale\",");
    print("\"uuid\":", uuid);
    print(",\"role\":", queriedSale.uuid_coffee);
    print(",\"buyer\":\"", name{queriedSale.buyer});
    print("\",\"seller\":\"", name{queriedSale.seller});
    print("\",\"quantity\":", queriedSale.quantity);
    print(",\"price\":", queriedSale.price);
    print(",\"total\":", queriedSale.total);
    print(",\"status\":", queriedSale.status);
    print("}");
    // {"action":"","user":"","role":"","hash":""}
    send_data(_self, queriedSale.status);
  }

  void Beancoin::shipsale(
    account_name seller,
    uint64_t uuid
  ) {
    require_auth(seller); // ONLY SELLER CAN MARK SALE AS SHIPPED
    // get sale and check
    sale_index sales(_self, _self);
    auto iterator_sales = sales.find(uuid);
    eosio_assert(iterator_sales != sales.end(), "Sale does not exist.");
    auto queriedSale = sales.get(uuid);
    // get coffee and check
    coffee_index coffees(_self, _self);
    auto iterator_coffees = coffees.find(queriedSale.uuid_coffee);
    eosio_assert(iterator_coffees != coffees.end(), "Coffee does not exist.");
    // modify coffee quantity
    coffees.modify(iterator_coffees, _self, [&](auto& row) {
      row.quantity = row.quantity - queriedSale.quantity;
    });
    // modify sale status
    sales.modify(iterator_sales, _self, [&](auto& row) {
      row.status = "2";
    });

    print("{\"action\":\"shipsale\",");
    print("\"uuid\":", uuid);
    print(",\"uuid_coffee\":", queriedSale.uuid_coffee);
    print(",\"buyer\":\"", name{queriedSale.buyer});
    print("\",\"seller\":\"", name{queriedSale.seller});
    print("\",\"quantity\":", queriedSale.quantity);
    print(",\"price\":", queriedSale.price);
    print(",\"total\":", queriedSale.total);
    print(",\"status\":\"", "2");
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
    send_data(_self, "2");
  }

  void Beancoin::fulfillsale(
    account_name buyer,
    uint64_t uuid
  ) {
    require_auth(buyer); // ONLY BUYER CAN RELEASE PAYMENT
    sale_index sales(_self, _self);
    auto iterator = sales.find(uuid);
    eosio_assert(iterator != sales.end(), "Sales does not exist.");
    auto queriedSale = sales.get(uuid);
    sales.modify(iterator, _self, [&](auto& row) {
      row.status = "3";
    });

    print("{\"action\":\"fulfillsale\",");
    print("\"uuid\":\"", uuid);
    print("\",\"uuid_coffee\":\"", queriedSale.uuid_coffee);
    print("\",\"buyer\":\"", name{queriedSale.buyer});
    print("\",\"seller\":\"", name{queriedSale.seller});
    print("\",\"quantity\":\"", queriedSale.quantity);
    print("\",\"price\":\"", queriedSale.price);
    print("\",\"total\":\"", queriedSale.total);
    print("\",\"status\":\"", "3");
    print("\"}");
    // {"action":"","user":"","role":"","hash":""}
    send_data(_self, "3");
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
