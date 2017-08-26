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
  it("should win with two bids", function() {
    var debug_clock, fiatcoin, ob, fromAddress;
    fromAddress = accounts[0];
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
    }).then(function (mint) {
      // check events
      assert.equal(mint.logs.length, 1, "1 event emmited on mint call");
      //event Mint(to: <indexed>, amount: 1e+21)
      assert.equal(mint.logs[0].event, "Mint", "event emmited by Mint is Mint");
      assert.equal(mint.logs[0].args.amount.toNumber(), "1000000000000000000000", "check Mint amount");
      return fiatcoin.balanceOf(OpenBids.address);
    }).then(function (balance_this) {
      assert.equal(balance_this.toNumber(), web3.toWei(1000, "ether"), "OpenBids has fiatcoins");
      return ob.getBidsLength.call();
    }).then(function (bids_length) {
      assert.equal(bids_length, 0, "bids len 0");
      return ob.bid(web3.toWei(5, "ether"), {value: web3.toWei(2000, "finney"), from: fromAddress});
    }).then(function (whatever) {
      return ob.bid(web3.toWei(5, "ether"), {value: web3.toWei(200, "finney"), from: fromAddress});
    }).then(function (whatever) {
      return debug_clock.get_time.call();
    }).then(function (now) {
      return debug_clock.set_time(now.toNumber() + 2*3600);
    }).then(function (whatever) {
      return ob.auctionEnd();
    }).then(function (auctionEnd) {
      // check events
      assert.equal(auctionEnd.logs.length, 5, "5 events emmited on auctionEnd call");
      // event AnnounceWinner(winner: 0x89e9f32dcc8a8481acd83a7debc532d392f992f1, fiat: 5000000000000000000)
      assert.equal(auctionEnd.logs[0].event, "AnnounceWinner", "event emmited by auctionEnd is AnnounceWinner");
      assert.equal(auctionEnd.logs[0].args.winner, fromAddress, "check AnnounceWinner winner");
      assert.equal(auctionEnd.logs[0].args.fiat, "5000000000000000000", "check AnnounceWinner fiat");
      // event AnnounceWinner(winner: 0x89e9f32dcc8a8481acd83a7debc532d392f992f1, fiat: 5000000000000000000)
      assert.equal(auctionEnd.logs[1].event, "AnnounceWinner", "event emmited by auctionEnd is AnnounceWinner");
      assert.equal(auctionEnd.logs[1].args.winner, fromAddress, "check AnnounceWinner winner");
      assert.equal(auctionEnd.logs[1].args.fiat, "5000000000000000000", "check AnnounceWinner fiat");
      // event SetAllowance(fiatBidAllowance: 5000000000000000000, etherBidAllowance: 1800000000000000000, bidDeposit: 2000000000000000000)
      assert.equal(auctionEnd.logs[2].event, "SetAllowance", "event emmited by auctionEnd is SetAllowance");
      assert.equal(auctionEnd.logs[2].args.fiatBidAllowance, 5000000000000000000, "check SetAllowance fiatBidAllowance");
      assert.equal(auctionEnd.logs[2].args.etherBidAllowance, 1800000000000000000, "check SetAllowance etherBidAllowance");
      assert.equal(auctionEnd.logs[2].args.bidDeposit, 2000000000000000000, "check SetAllowance bidDeposit");
      // SetAllowance(fiatBidAllowance: 5000000000000000000, etherBidAllowance: 0, bidDeposit: 200000000000000000)
      assert.equal(auctionEnd.logs[3].event, "SetAllowance", "event emmited by auctionEnd is SetAllowance");
      assert.equal(auctionEnd.logs[3].args.fiatBidAllowance, 5000000000000000000, "check SetAllowance fiatBidAllowance");
      assert.equal(auctionEnd.logs[3].args.etherBidAllowance, 0, "check SetAllowance etherBidAllowance");
      assert.equal(auctionEnd.logs[3].args.bidDeposit, 200000000000000000, "check SetAllowance bidDeposit");
      // event AuctionEnded(ftcEthRate: 25000000000000000000)
      assert.equal(auctionEnd.logs[4].event, "AuctionEnded", "event emmited by auctionEnd is AuctionEnded");
      assert.equal(auctionEnd.logs[4].args.ftcEthRate, 25000000000000000000, "AuctionEnded has correct ftcEth rate");
      return ob.finalRate.call();
    }).then(function (final_rate) {
      assert.equal(final_rate, web3.toWei(25000, "finney"), "final rate is correct");
      assert.equal(web3.eth.getBalance(OpenBids.address), web3.toWei(2200, "finney"), "bid has money");
      return ob.biddersAllowances.call(fromAddress);
    }).then(function (result) {
      assert.equal(result[0], web3.toWei(10, "ether"), "bids has the right fiat allowances");
      assert.equal(result[1], web3.toWei(1800, "finney"), "bids has the right ether allowances");
      return true;
    });
  });

  it("should win with one bids", function() {
    var debug_clock, fiatcoin, ob, fromAddress;
    fromAddress = accounts[0];
    return DebugClock.deployed().then(function (clock_instance) {
      debug_clock = clock_instance;
      return FiatBase.deployed();
    }).then(function (fiat_instance) {
      fiatcoin = fiat_instance;
      debug_clock.set_time.call(1503387838);
      return OpenBids.new(
        FiatBase.address,
        3600,                    // bidding time = 1 hour
        5503,                    // beneficiary address
        DebugClock.address,
        10,                       // minimum eth = 10 Wei
        web3.toWei(10, "ether")); // amount of fiat
    }).then(function (openbids_instance) {
      ob = openbids_instance;
      return fiatcoin.mint(ob.address, web3.toWei(1000, "ether"));
    }).then(function (mint) {
      // check events
      assert.equal(mint.logs.length, 1, "1 event emmited on mint call");
      //event Mint(to: <indexed>, amount: 1e+21)
      assert.equal(mint.logs[0].event, "Mint", "event emmited by Mint is Mint");
      assert.equal(mint.logs[0].args.amount.toNumber(), "1000000000000000000000", "check Mint amount");
      return fiatcoin.balanceOf(ob.address);
    }).then(function (balance_this) {
      assert.equal(balance_this.toNumber(), web3.toWei(1000, "ether"), "OpenBids has fiatcoins");
      return ob.getBidsLength.call();
    }).then(function (bids_length) {
      assert.equal(bids_length, 0, "bids len 0");
      return ob.bid(web3.toWei(5, "ether"), {value: web3.toWei(200, "finney"), from: fromAddress});
    }).then(function (whatever) {
      return debug_clock.get_time.call();
    }).then(function (now) {
      return debug_clock.set_time(now.toNumber() + 2*3600);
    }).then(function (whatever) {
      return ob.auctionEnd();
    }).then(function (auctionEnd) {
      // check events
      assert.equal(auctionEnd.logs.length, 3, "3 events emmited on auctionEnd call");
      // event AnnounceWinner(winner: 0x89e9f32dcc8a8481acd83a7debc532d392f992f1, fiat: 5000000000000000000)
      assert.equal(auctionEnd.logs[0].event, "AnnounceWinner", "event emmited by auctionEnd is AnnounceWinner");
      assert.equal(auctionEnd.logs[0].args.winner, fromAddress, "check AnnounceWinner winner");
      assert.equal(auctionEnd.logs[0].args.fiat, "5000000000000000000", "check AnnounceWinner fiat");
      // event SetAllowance(fiatBidAllowance: 5000000000000000000, etherBidAllowance: 0, bidDeposit: 2000000000000000000)
      assert.equal(auctionEnd.logs[1].event, "SetAllowance", "event emmited by auctionEnd is SetAllowance");
      assert.equal(auctionEnd.logs[1].args.fiatBidAllowance, 5000000000000000000, "check SetAllowance fiatBidAllowance");
      assert.equal(auctionEnd.logs[1].args.etherBidAllowance, 0, "check SetAllowance etherBidAllowance");
      assert.equal(auctionEnd.logs[1].args.bidDeposit, web3.toWei(200, "finney"), "check SetAllowance bidDeposit");
      // event AuctionEnded(ftcEthRate: 25000000000000000000)
      assert.equal(auctionEnd.logs[2].event, "AuctionEnded", "event emmited by auctionEnd is AuctionEnded");
      assert.equal(auctionEnd.logs[2].args.ftcEthRate, 25000000000000000000, "AuctionEnded has correct ftcEth rate");
      return ob.finalRate.call();
    }).then(function (final_rate) {
      assert.equal(final_rate, web3.toWei(25000, "finney"), "final rate is correct");
      assert.equal(web3.eth.getBalance(ob.address), web3.toWei(200, "finney"), "bid has money");
      return ob.biddersAllowances.call(fromAddress);
    }).then(function (result) {
      assert.equal(result[0], web3.toWei(5, "ether"), "bids has the right fiat allowances");
      assert.equal(result[1], web3.toWei(0, "finney"), "bids has the right ether allowances");
      return true;
    });
  });

  it("should win with zero bids", function() {
    var debug_clock, fiatcoin, ob, fromAddress;
    fromAddress = accounts[0];
    return DebugClock.deployed().then(function (clock_instance) {
      debug_clock = clock_instance;
      return FiatBase.deployed();
    }).then(function (fiat_instance) {
      fiatcoin = fiat_instance;
      debug_clock.set_time.call(1503387838);
      return OpenBids.new(
        FiatBase.address,
        3600,                    // bidding time = 1 hour
        5503,                    // beneficiary address
        DebugClock.address,
        10,                       // minimum eth = 10 Wei
        web3.toWei(10, "ether")); // amount of fiat
    }).then(function (openbids_instance) {
      ob = openbids_instance;
      return fiatcoin.mint(ob.address, web3.toWei(1000, "ether"));
    }).then(function (mint) {
      // check events
      assert.equal(mint.logs.length, 1, "1 event emmited on mint call");
      //event Mint(to: <indexed>, amount: 1e+21)
      assert.equal(mint.logs[0].event, "Mint", "event emmited by Mint is Mint");
      assert.equal(mint.logs[0].args.amount.toNumber(), "1000000000000000000000", "check Mint amount");
      return fiatcoin.balanceOf(ob.address);
    }).then(function (balance_this) {
      assert.equal(balance_this.toNumber(), web3.toWei(1000, "ether"), "OpenBids has fiatcoins");
      return ob.getBidsLength.call();
    }).then(function (bids_length) {
      assert.equal(bids_length, 0, "bids len 0");
      return debug_clock.get_time.call();
    }).then(function (now) {
      return debug_clock.set_time(now.toNumber() + 2*3600);
    }).then(function (whatever) {
      return ob.auctionEnd();
    }).then(function (auctionEnd) {
      // check events
      assert.equal(auctionEnd.logs.length, 1, "1 events emmited on auctionEnd call");
      // event AuctionEnded(ftcEthRate: 25000000000000000000)
      assert.equal(auctionEnd.logs[0].event, "AuctionEnded", "event emmited by auctionEnd is AuctionEnded");
      assert.equal(auctionEnd.logs[0].args.ftcEthRate, 0, "AuctionEnded has correct ftcEth rate");
      return ob.finalRate.call();
    }).then(function (final_rate) {
      assert.equal(final_rate, 0, "final rate is correct");
      assert.equal(web3.eth.getBalance(ob.address), 0, "bid has money");
      return ob.biddersAllowances.call(fromAddress);
    }).then(function (result) {
      assert.equal(result[0], web3.toWei(0, "ether"), "bids has the right fiat allowances");
      assert.equal(result[1], web3.toWei(0, "finney"), "bids has the right ether allowances");
      return true;
    });
  });
});
