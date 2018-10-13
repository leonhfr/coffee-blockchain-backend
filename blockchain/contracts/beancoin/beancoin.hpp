#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <string>

namespace CoffeeBlockchain {

  using namespace eosio;
  using std::string;

  class Beancoin : public contract {

    using contract::contract;

    public:
      Beancoin(account_name self) : contract(self) {}

      [[eosio::action]]
      void notify(
        account_name user,
        string message
      );

      [[eosio::action]]
      void upsertuser(
        account_name user,
        string role,
        string hash
      );

      [[eosio::action]]
      void deluser(
        account_name user
      );

      [[eosio::action]]
      void getuser(
        account_name user
      );

      [[eosio::action]]
      void upsertcoffee(
        account_name owner,
        string uuid,
        string hash,
        int64_t price,
        int64_t quantity
      );

      [[eosio::action]]
      void delcoffee(
        account_name owner,
        string uuid
      );

      [[eosio::action]]
      void getcoffee(
        account_name owner,
        string uuid
      );

      [[eosio::action]]
      void requestsale(
        string uuid,
        string uuid_coffee,
        account_name seller,
        account_name buyer,
        uint64_t quantity
      );

      [[eosio::action]]
      void getsale(
        string uuid
      );

      [[eosio::action]]
      void fulfillsale(
        string uuid
      );

    private:

      void send_data(
        account_name user,
        string data
      );

      // TODO: define private methods to change sale and coffee state

      struct [[eosio::table]] user {
        account_name username;
        string role;
        string hash;
        uint64_t primary_key() const { return username; }
        EOSLIB_SERIALIZE(user, (username)(role)(hash))
      };
      typedef eosio::multi_index<N(user), user> user_index;

      struct [[eosio::table]] coffee {
        uint64_t key;
        account_name owner;
        string uuid;
        string hash;
        uint64_t price;
        uint64_t quantity;
        uint64_t primary_key() const { return key; }
        // TODO: defined uuid as second key
        EOSLIB_SERIALIZE(coffee, (key)(owner)(uuid)(hash)(price)(quantity))
      };
      typedef eosio::multi_index<N(coffee), coffee> coffee_index;

      struct [[eosio::table]] sale {
        uint64_t key;
        string uuid;
        string uuid_coffee;
        account_name seller;
        account_name buyer;
        uint64_t quantity;
        uint64_t status;
        // STATUS CODES:
        // 0 = request
        // 1 = fulfilled (buyer paid)
        // 2 = rejected
        uint64_t primary_key() const { return key; }
        // TODO: defined uuid as second key
        EOSLIB_SERIALIZE(sale, (key)(uuid)(uuid_coffee)(seller)(buyer)(quantity)(status))
      };
      typedef eosio::multi_index<N(sale), sale> sale_index;
  };

  EOSIO_ABI(Beancoin, (notify)(upsertuser)(deluser)(getuser)(upsertcoffee)(delcoffee)(getcoffee)(requestsale)(getsale)(fulfillsale))
}
