

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

class SSRequestError extends Error {
    constructor(message, response) {
        super(message);
        this.response = response;
        this.name = "SSRequestError";
    }
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

    return new Promise((resolve, reject) => {
        // network tobalaba
        if (nId === 401697) {
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

function composeTx(web3, gas, gasprice, from, to, data) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'parity_composeTransaction',
            params: [{
                "gas": web3.utils.toHex(gas),
                "to": to,
                "gasPrice": web3.utils.toHex(gasprice),
                "from": from,
                "data": data,
            }],
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
                console.log(r);
                resolve(r.result);
            }
        });
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function privateComposeDeploymentTx(web3, raw, validators) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'private_composeDeploymentTransaction',
            params: ["latest", raw, validators, "0x0"],
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function privateCall(web3, tx) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'private_call',
            params: ["latest", tx],
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function privateSend(web3, tx) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'private_sendTransaction',
            params: [tx],
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function getJSONInterface(web3, abi, type, name) {
    return new Promise((resolve, reject) => {
        let res = abi.find((x) => {
            return (x.type === type && x.name === name)
        })
        if (res === undefined) {
            console.log(name + " with type " + type + " was not found in supplied JSON-ABI");
            reject(undefined)
        }
        resolve(res)
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

function ssSignRawHash(web3, account, pwd, hash) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'secretstore_signRawHash',
            params: [account, pwd, "0x" + hash],
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
                resolve(r.result);
            }
        });
    });
}

function ssGenerateServerKey(url, docID, signedDocID, threshold) {

    return new Promise((resolve, reject) => {
        const request = require('request');

        var options = {
            url: url + "/shadow/" + docID + "/" + signedDocID + "/" + threshold,
            method: 'POST'
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("error:");
                console.log(error);
                reject(error);
            }
            else if (response.statusCode != 200) {
                console.log("Request failed");
                console.log("statusCode: " + response.statusCode);
                console.log("statusMessage: " + response.statusMessage);
                console.log("body: " + body);
                console.log("Options: " + JSON.stringify(options));

                sserror = new SSRequestError("Request failed.", response);
                reject(sserror);
            }
            else {
                // the successful result should be the public part of the server key enclsed in quotes
                resolve(body.replace(/^"(.*)"$/, '$1'));
            }
        });
    });
}

function ssGetServerKey(url, docID, signedDocID) {
    return new Promise((resolve, reject) => {
        const request = require('request');

        var options = {
            url: url + "/shadow/" + docID + "/" + remove0x(signedDocID),
            method: 'GET'
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("error:");
                console.log(error);
                reject(error);
            }
            else if (response.statusCode != 200) {
                console.log("Request failed");
                console.log("statusCode: " + response.statusCode);
                console.log("statusMessage: " + response.statusMessage);
                console.log("body: " + body);
                console.log("Options: " + JSON.stringify(options));

                sserror = new SSRequestError("Request failed.", response);
                reject(sserror);
            }
            else {
                resolve(JSON.parse(body));
            }
        });
    });
}

function ssGenDocKey(web3, account, pwd, serverkey) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'secretstore_generateDocumentKey',
            params: [account, pwd, serverkey],
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function ssEncrypt(web3, account, pwd, encryptedKey, hexDocument) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'secretstore_encrypt',
            params: [account, pwd, encryptedKey, hexDocument],
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
                console.log(r);
                resolve(r.result);
            }
        });
    });
}

function ssShadowDecrypt(web3, account, pwd, decryptedSecret, commonPoint, decryptShadows, encryptedDocument) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send({
            jsonrpc: '2.0',
            method: 'secretstore_shadowDecrypt',
            params: [account, pwd, decryptedSecret, commonPoint, decryptShadows, encryptedDocument],
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
                resolve(r.result);
            }
        });
    });
}


function ssStoreDocKey(url, docID, signedDocID, commonPoint, encryptedPoint) {

    return new Promise((resolve, reject) => {
        const request = require('request');

        var options = {
            url: url + "/shadow/" + remove0x(docID)
                + "/" + remove0x(signedDocID)
                + "/" + remove0x(commonPoint)
                + "/" + remove0x(encryptedPoint),
            method: 'POST'
        };

        request(options, (error, response, body) => {
            if (error) {
                console.log("error:");
                console.log(error);
                reject(error);
            }
            else if (response.statusCode != 200) {
                console.log("Request failed");
                console.log("statusCode: " + response.statusCode);
                console.log("statusMessage: " + response.statusMessage);
                console.log("body: " + body);
                console.log("Options: " + JSON.stringify(options));

                sserror = new SSRequestError("Request failed.", response);
                reject(sserror);
            }
            else {
                // the successful result should be the public part of the server key enclsed in quotes
                resolve(body.replace(/^"(.*)"$/, '$1'));
            }
        });
    });
}



module.exports = {
    __awaiter,
    SSRequestError,
    remove0x,
    add0x,
    accounts,
    passwords,
    connectionsHTTPRPC,
    connectionsHTTPSS,
    composeTx,
    sendRawTx,
    privateComposeDeploymentTx,
    privateCall,
    privateSend,
    getJSONInterface,
    getSHA256hash,
    ssSignRawHash,
    ssGenerateServerKey,
    ssGetServerKey,
    ssGenDocKey,
    ssEncrypt,
    ssShadowDecrypt,
    ssStoreDocKey
}
