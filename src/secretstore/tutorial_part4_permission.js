const fs = require("fs");
const secretstore = require("secretstore-private-js").secretstore;

const utils = require("../utils.js");

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();
const { httpSSAlice, httpSSBob, httpSSCharlie } = utils.connectionsHTTPSS();

function tutorialPart4() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const Web3 = require("web3");
        const web3 = new Web3(httpRpcCharlie);

        console.log("Checking if Charlie has access..")

        const { alice, bob, charlie } = yield utils.accounts(web3);
        const { alicepwd, bobpwd, charliepwd } = yield utils.passwords(web3);
        console.log(charlie, charliepwd);

        // Bob receives the message: document ID and encrypted document
        const messageReceived = JSON.parse(fs.readFileSync("./sent_message.json"));
        console.log("Message received: " + JSON.stringify(messageReceived));

        // 1. signing the document ID by Bob
        const signedDoc = yield secretstore.signRawHash(web3, charlie, charliepwd, messageReceived.docID);
        console.log("Doc ID signed: " + signedDoc);

        // 2. Let's retrieve the keys
        const decryptionKeys = yield secretstore.session.shadowRetrieveDocumentKey(httpSSCharlie, messageReceived.docID, signedDoc);
        console.log("DecryptionKeys keys retrieved: " + JSON.stringify(decryptionKeys));
        console.log("Charlie sees everything.");

    });
}

tutorialPart4();