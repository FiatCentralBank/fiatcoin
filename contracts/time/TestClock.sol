pragma solidity ^0.4.11;

import './Clock.sol';

contract TestClock is Clock {
  uint date;

  function TestClock(uint _date)
    public 
  {
    date = _date;
  }

  function set_time(uint _date)
    public 
  {
    date = _date;
  }

  function get_time()
    public
    returns (uint)
  {
    return now;
  }
}
