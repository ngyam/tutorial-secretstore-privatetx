const utils = require("../utils.js");
const fs = require("fs");
const path = require("path");

const httpRPC = "http://localhost:8545";

const SSPermissions = require(path.join(__dirname, "../../build/contracts/SSPermissions.json"));
const SSPermissionsSimple = require(path.join(__dirname, "../../build/contracts/SSPermissionsSimple.json"));
const SSPermissionsComplex = require(path.join(__dirname, "../../build/contracts/SSPermissionsComplex.json"));

// Parity local dev network's prefunded rich account
const richAccount = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72";

// Hash of "mySecretDocument" as in the tutorial
const defaultDocID = "0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2";

const checkFunctionName = "checkPermissions(address,bytes32)";
const checkPermissionsAbi = {
    "constant": true,
    "inputs": [
        {
            "name": "user",
            "type": "address"
        },
        {
            "name": "document",
            "type": "bytes32"
        }
    ],
    "name": "checkPermissions",
    "outputs": [
        {
            "name": "",
            "type": "bool"
        }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
};

const args = require("yargs")
    .usage('Usage: $0 [options]')
    .option('address', {
        type: 'string',
        desc: "The address of the permission contract.",
        demandOption: true,
        alias: "a"
    })
    .option('docid', {
        type: 'string',
        desc: "The document's ID to check permissions for",
        demandOption: false,
        alias: "d",
        default: defaultDocID
    })
    .option('accounts', {
        type: 'array',
        desc: "Accounts to check for the given document ID. Defaults to the accounts of Alice, Bob and Charlie used in the tutorial.",
        demandOption: false,
        alias: "ac",
        default: []
    })
    .argv;

function checkPermissions() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const web3 = new (require("web3"))(httpRPC);

        const { alice, bob, charlie } = yield utils.accounts(web3);

        let accs;
        if (args.ac === undefined || args.ac.length === 0) {
            accs = [alice, bob, charlie];
        } else {
            accs = args.ac;
        }

        // deploy the permisioning contract
        for (let i = 0; i < accs.length; i++) {
            let acc = accs[i];
            let data = yield web3.eth.abi.encodeFunctionCall(checkPermissionsAbi, [acc, args.docid]);
            let result = yield web3.eth.call({
                to: args.address,
                data: data
            });
            console.log(result);
            console.log(acc + ": " + (web3.utils.hexToNumber(result) === 1));
        };
    });
}
checkPermissions();
