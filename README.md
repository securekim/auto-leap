# auto-leap
Automation start for plasma-leap (ETH)

# run
Path is /Users/cryptonian/Developer/github.com/cryptonian-base. Please make the directories.

$ vi cd /Users/cryptonian/Developer/github.com/cryptonian-base/auto-leap/auto-leap.js

and change first line (Your METAMASK account)

$ cd /Users/cryptonian/Developer/github.com/cryptonian-base/auto-leap

$ ./auto-leap.sh

# what is happend ?

1. Check essential programs for run (Truffle, TestRPC, Remixd)

2. Install essential programs if not exist.

3. Check Leap is cloned ( leap-core, bridge-ui, leap-contracts, leap-node )

4. Run Truffle, compile, deploy contracts

5. Run bridge-ui, remixd

6. Get addresses (NaiveStorageToken, ExitHandler) 

7. Add 10 ETH to METAMASK Account

8. Mint Account & Approve ExitHandler

# I want to know the addresses !

$ cat auto-leap.log
