# Secret store & private transactions tutorial code

Made along the lines of the official Parity [secret store (SS)](https://github.com/paritytech/wiki/blob/master/Secret-Store.md) and private [transactions](https://github.com/paritytech/wiki/blob/master/Private-Transactions.md) tutorial. What this repo can help you with:
 - Ease of setting up secret store nodes on various networks
 - Run the official Parity tutorial steps automated, with minimal manual fiddling
 - Simple CL tool for deploying permissioning contracts
 - JS abstraction of the ss/private [Parity API](https://wiki.parity.io/JSONRPC)
  
## Dependencies

- [Parity client](https://github.com/paritytech/parity-ethereum), compiled with secretstore feature enabled
- [Truffle](https://github.com/trufflesuite/truffle): Only used for compiling permissioning contracts
- node, npm
- web3.js, yargs
 
## Setup

### Install truffle

```bash
npm install -g truffle
```

### Clone the repo

```bash
git clone https://github.com/ngyam/tutorial-secretstore-privatetx.git
```

### Install node packages
```bash
cd tutorial-secretstore-privatetx
npm install
```

### Parity client

Following the [official tutorial](), you need to compile from source. Please use the latest master branch, as features/fixes are continuously being added:

```bash
git clone https://github.com/paritytech/parity
cd parity
cargo build --features secretstore --release
```

Then copy the `parity` binary from `<parity repo>/target/release` to the tutorial repo root folder which is `tutorial-secretstore-privatetx/` by default. The scripts are going to look for the client here.

## Where things are

- Secret store nodes, their chain & SS db-s: `nodes_ss_[networkname]/` folder. Set up and run you SS nodes with a simple command.
- Contracts: `contracts/`. These are various permissioning contracts that you can use for managing access to keys in SS.
- Compiled contracts: `build/contracts/`
- Secret store tutorial: `src/secretstore/`
- Private-tx tutorial `src/private-tx`
- JavaScript SS/privateTx abstraction `src/utils.js`

## How to use

### TL;DR
 1.  Start up secret store nodes with `./start.sh`.
 2.  Run the desired tutorial js files: `node <filename>.js`
 3.  Optional: compile contracts with ```truffle compile```
 4.  Optional: deploy permissioning contracts with `src/secretstore/deploy.js` node script.

### 1. Start a cluster of SS nodes

You can easily do this by running `./starth.sh` in the nodes_ss_[networkname] folder, depending on which network you need. Originally this tutorial is made for EWF's Tobalaba network, but you can launch SS nodes connected to a local dev network, local PoA, etc.

In the `nodes_ss_[networkname]` folder you can:

 - Edit configuration files of 3 different SS nodes (Alice, Bob, Charlie): `conf_[network]_[alice, bob, charlie].toml`. They use separate db folders, and write logs in `<db folder name>/parity.log`. Accounts with password files are created.

 - Start nodes
   ```bash
   ./start.sh
   ```
 - Stop nodes
   ```bash
   ./stop.sh
   ```
 - Clean SS db / chain db
   ```bash
   ./clean.sh
   ```

 - Send test tokens from the rich account in dev networks. E.g.:
   ```bash
   ./fund.sh 0x8b2c16e09bfb011c5e4883cedb105124ccf01af7 0x6c4b8b199a41b721e0a95df9860cf0a18732e76d 0x3144de21da6de18061f818836fa3db8f3d6b6989
   ```
   10 Ethers is sent to each of these accounts. Modify the rich account in the script if needed.


### 2. Run the tutorial files
```bash
node <tutorial_step>.js
```

#### Secret store (SS) tutorial
 - Alice, Bob and Charlie communicate with their own nodes, and not only with Alice's node as in the official example.
 - The encrypted document produced in [tutorial_part2_encrypt.js](./src/secretstore/tutorial_part2_encrypt.js) is written to `sent_message.json`. This is used in step 3.
 - Optional: deploy permission contracts with the [deployer](./src/secretstore/deploy.js) tool. Check CL flags with ```node deploy -h```.
 - Optional: check whether the permission contract returns the right values with the [permissioncheck](./src/secretstore/deploy.js) tool.


#### Private transactions tutorial
- Alice and Bob are using their own SS nodes for communication, unlike in the official tutorial (for simplicity).
