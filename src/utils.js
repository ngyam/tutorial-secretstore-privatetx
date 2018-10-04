
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function remove0x(str) {
    if (str.startsWith("0x")) {
        return str.slice(2);
    }
    return str;
}

function add0x(str) {
    if (!str.startsWith("0x")) {
        return "0x" + str;
    }
    return str;
}

async function accounts(web3) {
    // we return the diff accounts based on network id
    const nId = await web3.eth.net.getId();
    // console.log("nId"+ nId);

    return new Promise((resolve, reject) => {
        // network tobalaba || localPoA
        if (nId === 401697 || nId === 8995) {
            resolve({
                alice: "0xaf198921d2fd9c4f0a294a774f7a2aea9aae0631",
                bob: "0xcd2216eb651c37a0ea91ba27d784452870747aff",
                charlie: "0x7218a36efed0ab14a6295bb1c322ba1abbc4decf"
            });
        }

        resolve({
            alice: "0x3144de21da6de18061f818836fa3db8f3d6b6989",
            bob: "0x6c4b8b199a41b721e0a95df9860cf0a18732e76d",
            charlie: "0x8b2c16e09bfb011c5e4883cedb105124ccf01af7"
        });
    });
}

function connectionsHTTPRPC() {
    return {
            httpRpcAlice: "http://localhost:8545",
            httpRpcBob: "http://localhost:8547",
            httpRpcCharlie: "http://localhost:8549"
    };
}

function connectionsHTTPSS() {
    return {
            httpSSAlice: "http://127.0.0.1:8090",
            httpSSBob: "http://127.0.0.1:8091",
            httpSSCharlie: "http://127.0.0.1:8092"
    };
}

async function passwords(web3) {
    // we return the diff pwds based on network id
    const nId = await web3.eth.net.getId();
    const fs = require("fs");
    const path = require("path")

    return new Promise((resolve, reject) => {
        // network tobalaba
        if (nId === 401697) {
            try {
                resolve({
                    alicepwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_tobalaba/alice.pwd"), "utf-8"),
                    bobpwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_tobalaba/bob.pwd"), "utf-8"),
                    charliepwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_tobalaba/charlie.pwd"), "utf-8")
                });
            } catch (error) {
                reject(error);
            }
        }

        try {
            resolve({
                alicepwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_dev/alice.pwd"), "utf-8"),
                bobpwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_dev/bob.pwd"), "utf-8"),
                charliepwd: fs.readFileSync(path.join(__dirname, "../nodes_ss_dev/charlie.pwd"), "utf-8")
            });
        } catch (error) {
            reject(error);
        }
    });
}

function sendRawTx(web3, raw) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'eth_sendRawTransaction',
            params: [raw],
            id: 1
        }, (e, r) => {
            if (e) {
                console.log("error:");
                console.log(e);
                reject(e);
            }
            else if (r.error !== undefined) {
                console.log("error");
                console.log(r.error);
                reject(r.error)
            }
            else {
                //console.log(r);
                resolve(r.result);
            }
        });
    });
}

function getJSONInterface(web3, abi, type, name) {
    return new Promise((resolve, reject) => {
        let res = abi.find((x) => {
            return (x.type === type && x.name === name);
        })
        if (res === undefined) {
            console.log(name + " with type " + type + " was not found in supplied JSON-ABI");
            reject(undefined);
        }
        resolve(res);
    });
}

function getSHA256hash(message) {
    return new Promise((resolve, reject) => {
        try {
            const SHA256 = require("crypto-js/sha256");
            let hash = SHA256(message);
            resolve(hash.toString());
        } catch (err) {
            reject(err);
        }
    });
}

module.exports = {
    __awaiter,
    remove0x,
    add0x,
    accounts,
    passwords,
    connectionsHTTPRPC,
    connectionsHTTPSS,
    sendRawTx,
    getJSONInterface,
    getSHA256hash
}
