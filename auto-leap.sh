#!/bin/bash
sudo killall -9 node
sudo killall -9 sudo

echo "1. INSTALL CHECK"

echo "[CHECK] TESTRPC"
testrpc --help
if [ $? -eq 0 ];then
   echo "  [TESTRPC] CHECKED"
   else 
	echo "  [TESTRPC] INSTALL"
	sudo npm install -g ethereumjs-testrpc
fi

echo "[CHECK] TRUFFLE"
truffle --help
if [ $? -eq 0 ];then
   echo "  [TRUFFLE] CHECKED"
   else 
	echo "  [TRUFFLE] INSTALL"
	sudo npm install -g truffle
fi

echo "[CHECK] REMIXD"
remixd --help
if [ $? -eq 0 ];then
   echo "  [REMIXD] CHECKED"
   else 
	echo "  [REMIXD] INSTALL"
	sudo npm install -g remixd
fi

yarn add web3
yarn add request

## Always point the top.
echo "2. CHECK LEAP"
cd ..

project="leap-core"
echo "[$project] CHECK"
if [ ! -d "$project" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  git clone https://github.com/cryptonian-base/${project}.git
  cd ./${project}
  git checkout wip-cryptonian
  yarn
  cd ..
fi

## MASTER BRANCH ONLY
project="bridge-ui" 
echo "[$project] CHECK"
if [ ! -d "$project" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  git clone https://github.com/cryptonian-base/${project}.git
  cd ./${project}
  yarn
  cd ..
fi

## MASTER BRANCH ONLY
project="leap-contracts"
echo "[$project] CHECK"
if [ ! -d "$project" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  git clone https://github.com/cryptonian-base/${project}.git
  cd ./${project}
  yarn
  cd ..
fi

project="leap-node"
echo "[$project] CHECK"
if [ ! -d "$project" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  git clone https://github.com/cryptonian-base/${project}.git
  cd ./${project}
  git checkout wip-cryptonian
  yarn
  yarn add lotion
  cd ..
fi

cd leap-contracts
truffle networks --clean
testrpc&
sleep 5
truffle compile
truffle migrate --reset
truffle networks > ../auto-leap/auto-leap.log
sed -i 's/undefined\:undefined/localhost\:8545/g' build/nodeFiles/generatedConfig.json
cd ../leap-node
node index.js --config=../leap-contracts/build/nodeFiles/generatedConfig.json&
cd ../leap-contracts
sudo remixd -s . --remix-ide "https://remix.ethereum.org"&
python -mwebbrowser https://remix.ethereum.org&
cd ../bridge-ui
yarn start&
sleep 5
python -mwebbrowser http://localhost:1234&
cd ../auto-leap
yarn add web3
node auto-leap.js
