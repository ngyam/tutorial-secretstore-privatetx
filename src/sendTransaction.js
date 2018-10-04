
const accAlice = "0xaf198921d2fd9c4f0a294a774f7a2aea9aae0631"
const accBob = "0xcd2216eb651c37a0ea91ba27d784452870747aff"
const accCharlie = "0x7218a36efed0ab14a6295bb1c322ba1abbc4decf"

const PrivateContract = artifacts.require("./PrivateContract.sol");

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

Object.defineProperty(exports, "__esModule", { value: true });
function sendTransaction() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("deploying secretly");
        const Web3 = require("web3");
        const web3 = new Web3("http://localhost:8545");
        const EthereumTx = require('ethereumjs-tx');

        const transaction = new EthereumTx();

        transaction.gasLimit = web3.utils.toHex(7000000);
        transaction.gasPrice = web3.utils.toHex(0);
        transaction.nonce = web3.utils.toHex((yield web3.eth.getTransactionCount(accAlice)));
        transaction.data = PrivateContract.data;
        transaction.to = '';
        const privateKeyBuffer = Buffer.from("efb763f9ad8ef7854e4a72119d09eaea2b57976ed8d47fb243f1df2cb6b67e01", 'hex');
        transaction.sign(privateKeyBuffer);
        let serializedTx = "0x" + transaction.serialize().toString('hex');
        const deployTx = yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'private_composeDeploymentTransaction',
                params: [
                    "latest",
                    serializedTx,
                    ["0x3a3c18d7a6923dc3d96ce3bb721d1a3d812b04b7"],
                    "0x0"
                ],
                id: 1
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log("private_composeDeploymentTransaction");
                    console.log(r);
                    resolve(r);
                }
            });
        });
        const privateContractAddress = deployTx.result.receipt.contractAddress;
        console.log("deployTx.result");
        console.log(deployTx.result.receipt.contractAddress);
        console.log("");
        let transactionCompose = new EthereumTx();
        transactionCompose.nonce = deployTx.result.transaction.nonce;
        transactionCompose.gas = web3.utils.toHex(7000000);
        transactionCompose.data = deployTx.result.transaction.data;
        //   console.log(transactionCompose.toJSON())
        transactionCompose.sign(privateKeyBuffer);
        const composedserializedTx = transactionCompose.serialize().toString('hex');
        const finalTx = yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: ["0x" + composedserializedTx],
                id: 2
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log("ethRawTx");
                    console.log(r);
                    resolve(r);
                }
            });
        });
        let nonce = web3.utils.toHex((yield web3.eth.getTransactionCount("0x4e72c28081c730e01E6Ddb80aDac0FBD46b249c5")));
        console.log("nonce: after ethRawTx: " + nonce);
        const privateContractInstance = new web3.eth.Contract([
            {
                "constant": true,
                "inputs": [],
                "name": "x",
                "outputs": [
                    {
                        "name": "",
                        "type": "bytes32"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_new",
                        "type": "uint256"
                    }
                ],
                "name": "setRandomNr",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "randomNr",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_x",
                        "type": "bytes32"
                    }
                ],
                "name": "setX",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ], privateContractAddress);
        const encodedCall = privateContractInstance.methods.setX(web3.utils.toHex("42")).encodeABI();
        console.log("code");
        console.log(yield web3.eth.getCode(privateContractAddress));
        console.log("privContractAddress: " + privateContractAddress);
        yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'private_call',
                params: [
                    "latest",
                    { "from": "0x4e72c28081c730e01E6Ddb80aDac0FBD46b249c5", "to": privateContractAddress, "data": "0x0c55699c", "nonce": nonce }
                ],
                id: 1
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log(r);
                    resolve(r);
                }
            });
        });
        if (encodedCall === "0xbc64b76d2a00000000000000000000000000000000000000000000000000000000000000")
            console.log("same encoding!");
        else {
            console.log("different encoding!!!");
        }
        const parity_comppse = yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'parity_composeTransaction',
                params: [
                    {
                        from: "0x4e72c28081c730e01E6Ddb80aDac0FBD46b249c5",
                        to: privateContractAddress,
                        data: "0xbc64b76d2a00000000000000000000000000000000000000000000000000000000000000"
                    }
                ],
                id: 1,
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log(r);
                    resolve(r);
                }
            });
        });
        const params_send = parity_comppse.result;
        const personal_signTransaction = yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                method: "personal_signTransaction",
                params: [
                    params_send,
                    "alicepwd"
                ], id: 1, jsonrpc: "2.0"
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log(r);
                    resolve(r);
                }
            });
        });
        yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                method: "private_sendTransaction",
                params: [personal_signTransaction.result.raw],
                id: 1, jsonrpc: "2.0"
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log(r);
                    resolve(r);
                }
            });
        });
        nonce = web3.utils.toHex((yield web3.eth.getTransactionCount("0x4e72c28081c730e01E6Ddb80aDac0FBD46b249c5")));
        yield new Promise((resolve, reject) => {
            web3.currentProvider.send({
                jsonrpc: '2.0',
                method: 'private_call',
                params: [
                    "latest",
                    { "from": "0x4e72c28081c730e01E6Ddb80aDac0FBD46b249c5", "to": privateContractAddress, "data": "0x0c55699c", "nonce": nonce }
                ],
                id: 1
            }, (e, r) => {
                if (e) {
                    console.log("error:");
                    console.log(e);
                    reject(e);
                }
                else {
                    console.log(r);
                    resolve(r);
                }
            });
        });
    });
}
sendTransaction();
//# sourceMappingURL=sendTransaction.js.map