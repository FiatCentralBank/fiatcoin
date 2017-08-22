// Specifically request an abstraction for LibSort
var LibSort = artifacts.require("./LibSort.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var NowClock = artifacts.require("./time/NowClock.sol");
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

contract('NowClock', function(accounts) {
  it("should put 10000 NowClock in the first account", function() {
    return NowClock.deployed().then(function(instance) {
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
    return OpenBids.deployed().then(function(instance) {
      return true;
    });
  });
});
