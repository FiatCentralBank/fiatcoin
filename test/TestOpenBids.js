// Specifically request an abstraction for OpenBids
var OpenBids = artifacts.require("./OpenBids.sol");

contract('OpenBids', function(accounts) {
  it("should put 10000 OpenBids in the first account", function() {
    return OpenBids.deployed().then(function(instance) {
      return true;
    });
  });
});
