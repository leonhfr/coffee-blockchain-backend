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
      print("Inserted user(", role.c_str(), ") ", user, " of hash: '", hash.c_str(), "'.");
    } else {
      users.modify(iterator, user, [&](auto& row) {
        row.username = user;
        row.role = role;
        row.hash = hash;
      });
      print("Updated user(", role.c_str(), ") ", user, " of hash: '", hash.c_str(), "'.");
    }
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
    print("Deleted user ", user, ".");
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
    // TODO: user data
    string message = "User: " + user.c_str() + " | Role: " +
      queriedUser.role.c_str() + " | Hash: '" + queriedUser.hash.c_str() + "'";
    send_data(user, message);
  }

  // COFFEE

  void Beancoin::upsertcoffee(
    account_name owner,
    string uuid,
    string hash,
    int64_t price,
    int64_t quantity
  ) {
    // TODO: stuff
    print(
      "Upsert coffee | Owner: ", owner,
      " | uuid: ", uuid.c_str(),
      " | hash: ", hash.c_str(),
      " | price: ", price,
      " | quantity: ", quantity
    );
  }

  void Beancoin::delcoffee(
    account_name owner,
    string uuid
  ) {
    // TODO: stuff
    print(
      "Delete coffee | Owner: ", owner,
      " | uuid: ", uuid.c_str()
    );
  }

  void Beancoin::getcoffee(
    account_name owner,
    string uuid
  ) {
    // TODO: stuff
    print(
      "Get coffee | Owner: ", owner,
      " | uuid: ", uuid.c_str()
    );
  }

  // SALE

  void Beancoin::requestsale(
    string uuid,
    string uuid_coffee,
    account_name seller,
    account_name buyer,
    uint64_t quantity
  ) {
    // TODO stuff
    print("requestsale");
  }

  void Beancoin::approvesale(
    string uuid,
    account_name seller
  ) {
    // TODO: stuff
    print("approvesale");
  }

  void Beancoin::getsale(
    string uuid
  ) {
    // TODO: stuff
    print("getsale");
  }

  void Beancoin::fulfillsale(
    string uuid
  ) {
    // TODO: stuff
    print("fulfillsale");
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
