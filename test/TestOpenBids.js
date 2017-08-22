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


contract('OpenBids', function(ob) {
  it("should put 10000 OpenBids in the first account", function() {
    var debug_clock, fiatcoin;
    return DebugClock.deployed().then(function (clock_instance) {
      debug_clock = clock_instance;
      return FiatBase.deployed();
    }).then(function (fiat_instance) {
      fiatcoin = fiat_instance;
      web3.toWei(1, "ether");
      debug_clock.set_time.call(1503387838);
      fiatcoin.mint.call(this, web3.toWei(1000, "ether"));
    });
  });
});
