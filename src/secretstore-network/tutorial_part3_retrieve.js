const fs = require("fs");
const secretstore = require("secretstore");

const utils = require("../utils.js");

// local node endpoints
const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();

// network node endpoints
const remoteSS = utils.connectionsNetworkHTTPSS();

function tutorialPart3() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const Web3 = require("web3");
        const web3 = new Web3(httpRpcBob);
        const ss = new secretstore.SecretStore(web3, remoteSS.node1);

        const { alice, bob, charlie } = yield utils.accounts(web3);
        const { alicepwd, bobpwd, charliepwd } = yield utils.passwords(web3);
        console.log(bob, bobpwd);

        // Bob receives the message: document ID and encrypted document
        const messageReceived = JSON.parse(fs.readFileSync("./sent_message.json"));
        console.log("Message received: " + JSON.stringify(messageReceived));

        // 1. signing the document ID by Bob
        const signedDoc = yield ss.signRawHash(bob, bobpwd, messageReceived.docID);
        console.log("Doc ID signed: " + signedDoc);

        // 2. Let's retrieve the keys
        const decryptionKeys = yield ss.session.shadowRetrieveDocumentKey(messageReceived.docID, signedDoc, true);
        console.log("Decryption keys retrieved: " + JSON.stringify(decryptionKeys));

        // 3. Decrypt document
        //decryptedSecret, commonPoint, decryptShadows, encryptedDocument
        const hexDocument = yield ss.shadowDecrypt(bob, bobpwd,
            decryptionKeys.decrypted_secret,
            decryptionKeys.common_point,
            decryptionKeys.decrypt_shadows,
            messageReceived.encryptedDocument);
        console.log("Decrypted hex document: " + hexDocument);

        // 3.1 hex to str
        const document = web3.utils.hexToUtf8(hexDocument);
        console.log("Decrypted document: " + document);

    });
}

tutorialPart3();
