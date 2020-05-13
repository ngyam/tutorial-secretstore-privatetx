const path = require("path");
const utils = require("../utils.js");

const { ACCOUNT_LOCAL } = require("../../settings.js");

const PermissioningStatic = require("secretstore-contracts/build/contracts/PermissioningStatic.json");
const PermissioningFireAndForget = require("secretstore-contracts/build/contracts/PermissioningFireAndForget.json");
const PermissioningNoDoc = require("secretstore-contracts/build/contracts/PermissioningNoDoc.json");
const PermissioningDynamic = require("secretstore-contracts/build/contracts/PermissioningDynamic.json");

// Parity local dev network's prefunded rich account
const richAccount = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";

// Hash of "mySecretDocument" as in the tutorial
const defaultDocID = "0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2";

const args = require("yargs")
    .usage('Usage: $0 [options]')
    .option('mode', {
        type: 'number',
        desc: "which Smart Contract to deploy. 0: default = a static registry with hardcoded values of Alice, Bob and docID from the official tutorial, 1: simple = the doc ID and accounts can be chosen, 2: complex = registry - an arbitrary number of ID's and accounts can be added, 3: simple nodoc = same as 'simple' but docID's don't matter",
        choices: [0, 1, 2, 3],
        demandOption: false,
        alias: "m",
        default: 0
    })
    .option('docid', {
        type: 'string',
        desc: "The document's ID to permission",
        demandOption: false,
        alias: "d",
        default: defaultDocID
    })
    .option('accounts', {
        type: 'array',
        desc: "Accounts that have access to this document's keys. Defaults to the accounts of Alice and Bob used in the tutorial.",
        demandOption: false,
        alias: "a",
        default: []
    })
    .option('from', {
        type: 'string',
        desc: "Deployer account. Defaults to pre-fundend account on the local poa test network: 0x00a329c0648769A73afAc7F9381E08FB43dBEA72.",
        demandOption: false,
        alias: "f",
        default: undefined
    })
    .option('rpc', {
        type: 'string',
        desc: "RPC endpoint. Defaults to localhost:8545",
        demandOption: false,
        alias: "r",
        default: "http://localhost:8545"
    })
    .argv;

async function deployPermissioningContract() {
    const Web3 = require("web3");
    const web3 = new Web3(args.rpc);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;

    let accs;
    accs = (args.a === undefined || args.a.length === 0) ? [ALICE[0], BOB[0]] : args.a;

    
    let deployer = args.from;
    //console.log(args);
    const cid = await web3.eth.getChainId();
    console.log(`Using chain with ID ${cid}`);
    if (deployer === undefined) {
        if (cid === 73799 || cid === 246) {
            localAccounts = await web3.eth.getAccounts();
            if (localAccounts !== undefined && localAccounts.lenght !== 0) {
                web3.eth.defaultAccount = localAccounts[0];
                deployer = web3.eth.defaultAccount;
            } else {
                throw("Please specify/unlock an account to deploy from.");
            }
        } else {
            // we need to unlock the deployer account
            web3.eth.defaultAccount = richAccount;
            deployer = richAccount;
            web3.eth.personal.unlockAccount(deployer, "");
        }
    }
    
    const tx = {
        from: deployer,
        gas: "500000",
        gasPrice: "1000000"
    }

    // deploy the permisioning contract
    if (args.mode === 1) {
        console.log(`Deploying simple from ${deployer}:`)
        Contract = new web3.eth.Contract(PermissioningFireAndForget.abi, {data: PermissioningFireAndForget.bytecode});
        contractPermissions = await Contract.deploy({arguments: [args.docid, accs]}).send(tx);
    } else if (args.mode === 2) {
        console.log(`Deploying complex from ${deployer}:`)
        Contract = new web3.eth.Contract(PermissioningDynamic.abi, {data: PermissioningDynamic.bytecode});
        contractPermissions = await Contract.deploy({arguments: [args.docid, accs]}).send(tx);
    } else if (args.mode === 3) {
        console.log(`Deploying simple nodoc from ${deployer}:`)
        Contract = new web3.eth.Contract(PermissioningNoDoc.abi, {data: PermissioningNoDoc.bytecode});
        contractPermissions = await Contract.deploy({arguments: [accs]}).send(tx);
    } else {
        console.log(`Deploying default from ${deployer}:`)
        Contract = new web3.eth.Contract(PermissioningStatic.abi, {data: PermissioningStatic.bytecode});
        contractPermissions = await Contract.deploy().send(tx);
    }
    console.log(contractPermissions.options.address);
}

deployPermissioningContract();
