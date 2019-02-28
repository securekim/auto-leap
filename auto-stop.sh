#!/bin/bash
sudo killall -9 node
sudo killall -9 sudo
cd ../leap-contracts
truffle networks --clean
rm ../auto-leap/auto-leap.log

