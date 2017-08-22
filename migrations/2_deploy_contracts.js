var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var LibSort = artifacts.require("./LibSort.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var DebugClock = artifacts.require("./time/DebugClock.sol");
var FiatBase = artifacts.require("./FiatBase.sol");
var OpenBids = artifacts.require("./OpenBids.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(LibSort).then(function() {
    return deployer.deploy(SafeMath);
  }).then(function() {
    return deployer.deploy(DebugClock, 1503387837); // date is more or less mar ago 22 09:43:53 CEST 2017
  }).then(function() {
    return deployer.deploy(FiatBase);
  }).then(function() {
    return deployer.deploy(
      OpenBids,
      FiatBase.address,
      3600,                    // bidding time = 1 hour
      5503,                    // beneficiary address
      DebugClock.address,
      10,                       // minimum eth = 10 Wei
      web3.toWei(10, "ether")); // amount of fiat
  });
};
