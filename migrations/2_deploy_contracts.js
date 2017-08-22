var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var LibSort = artifacts.require("./LibSort.sol");
var SafeMath = artifacts.require("./SafeMath.sol");
var NowClock = artifacts.require("./time/NowClock.sol");
var FiatBase = artifacts.require("./FiatBase.sol");
var OpenBids = artifacts.require("./OpenBids.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(LibSort).then(function() {
    return deployer.deploy(SafeMath);
  }).then(function() {
    return deployer.deploy(NowClock);
  }).then(function() {
    return deployer.deploy(FiatBase);
  }).then(function() {
    return deployer.deploy(OpenBids, FiatBase.address, 0,5503,NowClock.address,0.1,10);
  });
};
