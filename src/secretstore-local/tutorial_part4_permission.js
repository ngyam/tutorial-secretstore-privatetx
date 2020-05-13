const fs = require("fs");

const secretstore = require("secretstore");

const utils = require("../utils.js");
const { ACCOUNT_LOCAL, HTTP_RPC_LOCAL, HTTP_SS_LOCAL } = require("../../settings.js");

async function tutorialPart4() {
    console.warn("! Warning: Make sure you run Charlie's local node")
    console.log();
    const Web3 = require("web3");
    const web3 = new Web3(HTTP_RPC_LOCAL.CHARLIE);
    const ss = new secretstore.SecretStore(web3, HTTP_SS_LOCAL.CHARLIE);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;
    console.log(CHARLIE[0], CHARLIE[1]);

    console.log("Checking if Charlie has access..")

    // Charlie intercepts the message: document ID and encrypted document
    const messageReceived = JSON.parse(fs.readFileSync("./sent_message.json"));
    console.log("Message received: " + JSON.stringify(messageReceived));

    // 1. signing the document ID by Bob
    const signedDoc = await ss.signRawHash(CHARLIE[0], CHARLIE[1], messageReceived.docID);
    console.log("Doc ID signed: " + signedDoc);

    // 2. Let's retrieve the keys
    console.log("    retrieving document key shadows..");
    let decryptionKeys;
    try {
        decryptionKeys = await ss.session.shadowRetrieveDocumentKey(messageReceived.docID, signedDoc, false);
    } catch(error) {
        if (error instanceof secretstore.SecretStoreSessionError) {
            console.log("Charlie cannot access!");
            return;
        }
        throw error;
    }
    console.log("DecryptionKeys keys retrieved: " + JSON.stringify(decryptionKeys));
    console.log("Charlie sees everything.");
}

tutorialPart4();