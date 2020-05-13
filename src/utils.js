require("dotenv").config();

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

function addEnvWallet(web3) {
    web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
}

module.exports = {
    remove0x,
    add0x,
    sendRawTx,
    getJSONInterface,
    getSHA256hash,
    addEnvWallet
}
