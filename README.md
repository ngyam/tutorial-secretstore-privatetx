# Secret store & private transactions tutorial code

Made along the lines of the official Parity [Secret Store (SS)](https://openethereum.github.io/wiki/Secret-Store) and Private [Transactions](https://openethereum.github.io/wiki/Private-Transactions) tutorial. This repo can help you with running the official Parity tutorials scripted with a secret store client library, deploying permissioning contracts and setting up a cluster. For all the secretstore permissioning and management contracts, check out [this repo](https://github.com/energywebfoundation/secretstore-contracts).
  
## Dependencies

- [OpenEthereum (Parity) client](https://github.com/openethereum/openethereum), compiled with secretstore feature enabled
- [Truffle](https://github.com/trufflesuite/truffle): Only used for compiling permissioning contracts
- node, npm
- npm packages: web3.js, yargs, crypto-js, [secretstore](https://github.com/energywebfoundation/secretstore-js), secretstore-private-js
 
## Setup

### Clone the repo

```bash
git clone https://github.com/ngyam/tutorial-secretstore-privatetx.git
```

### Install node packages
```bash
cd tutorial-secretstore-privatetx
npm install -D
```

### OpenEthereum client

Following the [official tutorial](https://openethereum.github.io/wiki/Secret-Store-Tutorial-overview), you need to compile from source. Use the latest beta.

```bash
git clone https://github.com/openethereum/openethereum.git
cd parity
cargo build --features secretstore --release
```

Then copy the client binary to the tutorial repo root folder which is `tutorial-secretstore-privatetx/` by default. The scripts are going to look for the client here.

## Where things are

- Secret store nodes, their chain & SS db-s: `nodes_ss_[networkname]/` folder. Set up and run you SS nodes with a simple command.
- Contracts: `contracts/`. Needed for the private transactions tutorial.
- Compiled contracts: `build/contracts/`
- Secret store tutorial: `src/secretstore/`
- Private-tx tutorial `src/private-tx`

## How to use

### TL;DR:
 1.  Start up secret store cluster with `./start.sh` in their respective folder. Even if you use a remote secretstore cluster, you need to have the local nodes running for the tutorial
 2.  Run the desired tutorial files in the `src` directory: `node <filename>.js`

### 1. Start a cluster of SS nodes

You can easily do this by running `./starth.sh` in the nodes_ss_[networkname] folder, depending on which one you need. Just using the local test steup nodes_ss_localpoa is recommended.

In the `nodes_ss_[networkname]` folder you can:

 - Edit configuration files of 3 different SS nodes (Alice, Bob, Charlie) which are fully connected: `conf_[network]_[alice, bob, charlie].toml`. They use separate db folders, and write logs in `<db folder name>/parity.log`. Accounts with password files are there too which are free to use by anyone for the sake of this tutorial.

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
They are the official Parity tutorial steps scripted in separate files.

### Good to know: Secret store (SS) tutorial
 - Alice, Bob and Charlie communicate with their own nodes, and not only with Alice's node as in the official example.
 - The encrypted document produced in `tutorial_part2_encrypt.js` is written to `sent_message.json`. This is used for step 3.
 - Optional: deploy permissioning contracts with the [deployer](./src/secretstore/deploy.js) tool. Check CL flags with ```node deploy -h```. Contracts can be found in [this repo](https://github.com/energywebfoundation/secretstore-contracts)
 - Optional: check whether the permission contract returns the right values with the [permissioncheck](./src/secretstore/permissioncheck.js) tool.


### Good to know: Private transactions tutorial
- Alice and Bob are using their own SS nodes for communication, unlike in the official tutorial (for simplicity).
