const fs = require("fs");

const secretstore = require("secretstore");

const utils = require("../utils.js");
const { ACCOUNT_LOCAL, HTTP_RPC_LOCAL, HTTP_SS_LOCAL } = require("../../settings.js");

async function tutorialPart3() {
    console.warn("! Warning: Make sure you run Bob's local node")
    console.log();
    const Web3 = require("web3");
    const web3 = new Web3(HTTP_RPC_LOCAL.BOB);
    const ss = new secretstore.SecretStore(web3, HTTP_SS_LOCAL.BOB);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;
    console.log(BOB[0], BOB[1]);

    // Bob receives the message: document ID and encrypted document
    const messageReceived = JSON.parse(fs.readFileSync("./sent_message.json"));
    console.log("Message received: " + JSON.stringify(messageReceived));

    // 1. signing the document ID by Bob
    const signedDoc = await ss.signRawHash(BOB[0], BOB[1], messageReceived.docID);
    console.log("Doc ID signed: " + signedDoc);

    // 2. Let's retrieve the keys
    console.log("    retrieving document key shadows..")
    const decryptionKeys = await ss.session.shadowRetrieveDocumentKey(messageReceived.docID, signedDoc, true);
    console.log("Decryption keys retrieved: " + JSON.stringify(decryptionKeys));

    // 3. Decrypt document
    //decryptedSecret, commonPoint, decryptShadows, encryptedDocument
    console.log("    decrypting document..")
    const hexDocument = await ss.shadowDecrypt(BOB[0], BOB[1],
        decryptionKeys.decrypted_secret,
        decryptionKeys.common_point,
        decryptionKeys.decrypt_shadows,
        messageReceived.encryptedDocument);
    console.log("Decrypted hex document: " + hexDocument);

    // 3.1 hex to str
    const document = web3.utils.hexToUtf8(hexDocument);
    console.log("Decrypted document: " + document);
}

tutorialPart3();
