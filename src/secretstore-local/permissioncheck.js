const path = require("path");

const { ACCOUNT_LOCAL } = require("../../settings.js");

// Hash of "mySecretDocument" as in the tutorial
const defaultDocID = "0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2";

const checkFunctionName = "checkPermissions(address,bytes32)";
const checkPermissionsAbi = {"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"document","type":"bytes32"}],"name":"checkPermissions","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"};

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
    .option('rpc', {
        type: 'string',
        desc: "RPC endpoint. Defaults to localhost:8545",
        demandOption: false,
        alias: "r",
        default: "http://localhost:8545"
    })
    .argv;

async function checkPermissions() {
    const Web3 = require("web3");
    const web3 = new Web3(args.rpc);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;

    let accs;
    accs = (args.accounts === undefined || args.accounts.length === 0) ? [ALICE[0], BOB[0], CHARLIE[0]] : args.accounts;

    // deploy the permisioning contract
    console.log(`Checking contract ${args.address} for docID ${args.docid}:`)
    for (let i = 0; i < accs.length; i++) {
        let acc = accs[i];
        let data = await web3.eth.abi.encodeFunctionCall(checkPermissionsAbi, [acc, args.docid]);
        let result = await web3.eth.call({
            to: args.address,
            data: data
        });
        //console.log(result);
        console.log(acc + ": " + (web3.utils.hexToNumber(result) === 1));
    }
}

checkPermissions();
