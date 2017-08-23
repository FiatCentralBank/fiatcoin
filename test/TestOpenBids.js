// Specifically request an abstraction for LibSort
var LibSort = artifacts.require("./LibSort.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var DebugClock = artifacts.require("./time/DebugClock.sol");
var FiatBase = artifacts.require("./FiatBase.sol");
var OpenBids = artifacts.require("./OpenBids.sol");


contract('LibSort', function(accounts) {
  it("should put 10000 LibSort in the first account", function() {
    return LibSort.deployed().then(function(instance) {
      return true;
    });
  });
});

contract('SafeMath', function(accounts) {
  it("should put 10000 SafeMath in the first account", function() {
    return SafeMath.deployed().then(function(instance) {
      return true;
    });
  });
});

contract('DebugClock', function(accounts) {
  it("should put 10000 DebugClock in the first account", function() {
    return DebugClock.deployed().then(function(instance) {
      return true;
    });
  });
});

contract('FiatBase', function(accounts) {
  it("should put 10000 FiatBase in the first account", function() {
    return FiatBase.deployed().then(function(instance) {
      return true;
    });
  });
});

contract('OpenBids', function(accounts) {
  it("should put 10000 OpenBids in the first account", function() {
    var debug_clock, fiatcoin, ob;
    return DebugClock.deployed().then(function (clock_instance) {
      debug_clock = clock_instance;
      return FiatBase.deployed();
    }).then(function (fiat_instance) {
      fiatcoin = fiat_instance;
      debug_clock.set_time.call(1503387838);
      return OpenBids.deployed();
    }).then(function (openbids_instance) {
      ob = openbids_instance;
      return fiatcoin.mint(OpenBids.address, web3.toWei(1000, "ether"));
    }).then(function (whatever) {
      return fiatcoin.balanceOf(OpenBids.address);
    }).then(function (balance_this) {
      assert.equal(balance_this.toNumber(), web3.toWei(1000, "ether"), "OpenBids has fiatcoins");
      return ob.getBidsLength.call();
    }).then(function (bids_length) {
      assert.equal(bids_length, 0, "bids len 0");
      return ob.bid(web3.toWei(5, "ether"), {value: web3.toWei(2000, "finney")});
    }).then(function (whatever) {
      return ob.bid(web3.toWei(5, "ether"), {value: web3.toWei(200, "finney")});
    }).then(function (whatever) {
      return debug_clock.get_time.call();
    }).then(function (now) {
      return debug_clock.set_time(now.toNumber() + 2*3600);
    }).then(function (whatever) {
      return ob.auctionEnd();
    }).then(function (whatever) {
      return ob.getFinalRate.call();
    }).then(function (final_rate) {
      assert.equal(final_rate, web3.toWei(25000, "finney"), "final rate is correct");
      return true;
    });
  });
});
