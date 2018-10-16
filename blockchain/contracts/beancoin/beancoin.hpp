#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include <boost/lexical_cast.hpp>
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
        uint64_t uuid,
        string hash,
        int64_t price,
        int64_t quantity
      );

      [[eosio::action]]
      void delcoffee(
        account_name owner,
        uint64_t uuid
      );

      [[eosio::action]]
      void getcoffee(
        uint64_t uuid
      );

      [[eosio::action]]
      void initiatesale(
        uint64_t uuid,
        uint64_t uuid_coffee,
        account_name buyer,
        uint64_t quantity
      );

      [[eosio::action]]
      void getsale(
        uint64_t uuid
      );

      [[eosio::action]]
      void shipsale(
        account_name seller,
        uint64_t uuid
      );

      [[eosio::action]]
      void fulfillsale(
        account_name buyer,
        uint64_t uuid
      );

    private:

      void send_data(
        account_name user,
        string data
      );

      struct [[eosio::table]] user {
        account_name username;
        string role;
        string hash;
        uint64_t primary_key() const { return username; }
        EOSLIB_SERIALIZE(user, (username)(role)(hash))
      };
      typedef eosio::multi_index<N(user), user> user_index;

      struct [[eosio::table]] coffee {
        uint64_t uuid;
        account_name owner;
        string hash;
        uint64_t price;
        uint64_t quantity;
        uint64_t primary_key() const { return uuid; }
        EOSLIB_SERIALIZE(coffee, (uuid)(owner)(hash)(price)(quantity))
      };
      typedef eosio::multi_index<N(coffee), coffee> coffee_index;

      struct [[eosio::table]] sale {
        uint64_t uuid;
        uint64_t uuid_coffee;
        account_name seller;
        account_name buyer;
        uint64_t quantity;
        uint64_t price;
        uint64_t total;
        string status;
        uint64_t primary_key() const { return uuid; }
        EOSLIB_SERIALIZE(sale, (uuid)(uuid_coffee)(seller)(buyer)(quantity)(price)(total)(status))
      };
      typedef eosio::multi_index<N(sale), sale> sale_index;
  };

  EOSIO_ABI(Beancoin, (notify)(upsertuser)(deluser)(getuser)(upsertcoffee)(delcoffee)(getcoffee)(initiatesale)(getsale)(shipsale)(fulfillsale))
}
