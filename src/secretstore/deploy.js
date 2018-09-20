const utils = require("../utils.js");
const fs = require("fs");
const path = require("path");

const httpRPC="http://localhost:8545";

const SSPermissions = require(path.join(__dirname, "../../build/contracts/SSPermissions.json"));
const SSPermissionsSimple = require(path.join(__dirname, "../../build/contracts/SSPermissionsSimple.json"));
const SSPermissionsComplex = require(path.join(__dirname, "../../build/contracts/SSPermissionsComplex.json"));

// Parity local dev network's prefunded rich account
const richAccount = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";

// Hash of "mySecretDocument" as in the tutorial
const defaultDocID = "0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2";

const args = require("yargs")
                .usage('Usage: $0 [options]')
                .option('mode', {
                    type: 'number',
                    desc: "which Smart Contract to deploy. 0: default = provided in the official tutorial with hard coded values, 1: simple = the doc ID and accounts can be chosen, 2: complex = registry - an arbitrary number of ID's and accounts can be added",
                    choices: [0, 1, 2],
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
                    desc: "Deployer account. Defaults to pre-fundend account on the test network, and default account on Tobalaba.",
                    demandOption: false,
                    alias: "f",
                    default: undefined
                })
                .argv;

function deployPermissioningContract() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const Web3 = require("web3");
        const web3 = new Web3(httpRPC);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);

        let accs;
        if (args.a === undefined || args.a.length === 0) {
            accs = [alice, bob];
        } else {
            accs = args.a;
        }

        
        let deployer = args.from;
        console.log(args);
        const nId = yield web3.eth.net.getId();
        
        if (deployer === undefined) {
            if (nId === 401697 || nId === 8995) {
                localAccounts = yield web3.eth.getAccounts();
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
       

        // deploy the permisioning contract
        if (args.mode === 1) {
            console.log("Deploying simple:")
            Contract = new web3.eth.Contract(SSPermissionsSimple.abi, {data: SSPermissionsSimple.bytecode});
            contractPermissions = yield Contract.deploy({arguments: [args.docid, accs]}).send({
                from: deployer,
            });
        } else if (args.mode === 2) {
            console.log("Deploying complex:")
            Contract = new web3.eth.Contract(SSPermissionsComplex.abi, {data: SSPermissionsComplex.bytecode});
            contractPermissions = yield Contract.deploy({arguments: [args.docid, accs]}).send({
                from: deployer,
            });
        } else {
            console.log("Deploying default:")
            Contract = new web3.eth.Contract(SSPermissions.abi, {data: SSPermissions.bytecode});
            contractPermissions = yield Contract.deploy().send({
                from: deployer,
            });
        }
        console.log(contractPermissions.options.address);
    });
}

deployPermissioningContract();