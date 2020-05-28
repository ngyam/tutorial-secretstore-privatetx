const fs = require("fs");

const secretstore = require("secretstore");
const ecies = require("ecies-parity");

const utils = require("../utils.js");
const { ACCOUNT_LOCAL, HTTP_RPC_LOCAL, HTTP_SS_NETWORK, HTTP_RPC_NETWORK } = require("../../settings.js");


async function tutorialPart3() {
    console.warn("! Warning: Make sure you run Bob's local node");
    console.log();
    const chainID = 73799;
    const Web3 = require("web3");
    const web3 = new Web3(HTTP_RPC_LOCAL.BOB);
    const ss = new secretstore.SecretStore(web3, HTTP_SS_NETWORK[chainID][1]);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;
    console.log(BOB[0], BOB[1]);

    // Bob receives the message: document ID and encrypted document
    const messageReceived = JSON.parse(fs.readFileSync("./sent_message.json"));
    console.log("Message received: " + JSON.stringify(messageReceived));

    // 1. signing the document ID by Bob
    const signedDoc = await ss.signRawHash(BOB[0], BOB[1], messageReceived.docID);
    console.log("Doc ID signed: " + signedDoc);

    // 2. Let's retrieve the keys
    console.log("    retrieving document key shadows..");
    const decryptionKeys = await ss.session.shadowRetrieveDocumentKey(messageReceived.docID, signedDoc, true);
    console.log("Decryption keys retrieved: " + JSON.stringify(decryptionKeys));

    console.log("    retrieving full document key too..");
    const encDocKey = await ss.session.retrieveDocumentKey(messageReceived.docID, signedDoc, true);
    console.log("Encrypted document key: " + encDocKey);

    console.log("    decrypting document key..");
    const docKey = await ecies.decrypt(Buffer.from(BOB[2].slice(2), "hex"), Buffer.from(encDocKey.slice(2), "hex"));
    console.log("Decrypted document key: 0x" + docKey.toString("hex"));

    console.log(await ecies.encrypt(docKey, Buffer.from("mySecretDocument")));

    // 3. Decrypt document
    //decryptedSecret, commonPoint, decryptShadows, encryptedDocument
    console.log("    decrypting document using key shadows..")
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
