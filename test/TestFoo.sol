pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Foo.sol";

contract TestFoo {
  Foo t;

  function testInitialA() {
    t = new Foo();

    bool expected = false;
    Assert.equal(t.ftest(), expected, "should return false");
  }
} 
