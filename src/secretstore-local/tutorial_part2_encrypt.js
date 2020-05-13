const fs = require("fs");

const secretstore = require("secretstore");

const utils = require("../utils.js");
const { ACCOUNT_LOCAL, HTTP_RPC_LOCAL, HTTP_SS_LOCAL } = require("../../settings.js");


const document = "mySecretDocument";

async function tutorialPart2() {
    console.warn("! Warning: Make sure you run Alice's local node")
    console.log();
    const Web3 = require("web3");
    const web3 = new Web3(HTTP_RPC_LOCAL.ALICE);
    const ss = new secretstore.SecretStore(web3, HTTP_SS_LOCAL.ALICE);

    const {ALICE: ALICE, BOB: BOB, CHARLIE: CHARLIE} = ACCOUNT_LOCAL;
    console.log(ALICE[0], ALICE[1]);

    let messageToSend = {}

    // 1. we generate a hash of the document name as the document ID
    const docID = await utils.getSHA256hash(document);
    console.log("doc ID: " + docID);

    messageToSend.docID = docID;

    // 2.1 we sign the document key id
    const signedDocID = await ss.signRawHash(ALICE[0], ALICE[1], docID);
    console.log("signed doc ID: " + signedDocID);

    // 2.2 we generate the secret store server key
    let serverKey
    try {
        console.log("    generating server key..")
        // threshold is chosen to be 1 like in the official tutorial
        serverKey = await ss.session.generateServerKey(docID, signedDocID, 1);
    } catch(error) {
        if (error instanceof secretstore.SecretStoreSessionError) {
            if (error.response.body === '"\\"Server key with this ID is already generated\\""' || 
                    error.response.body === '"\\"session with the same id is already registered\\""' ) {
                console.log("    trying to retrieve existing server key..")
                try {
                    serverKey = await ss.session.retrieveServerKeyPublic(docID, signedDocID, true);
                } catch(error) {
                    throw error;
                }
            }
            else {
                throw error;
            }
        } else {  
            throw error;
        }
    }
    console.log("Server key public part: " + JSON.stringify(serverKey));

    // 3. Generate document key
    console.log("    generating document key..")
    const documentKey = await ss.generateDocumentKey(ALICE[0], ALICE[1], serverKey);
    console.log("Document key" + JSON.stringify(documentKey));

    // 4.-1 the document in hex format
    const hexDocument = web3.utils.toHex(document);
    console.log("Hex document: " + hexDocument);
    
    // 4. Document encryption
    console.log("    encrypting document..")
    const encryptedDocument = await ss.encrypt(ALICE[0], ALICE[1], documentKey.encrypted_key, hexDocument);
    console.log("Encrypted secret document: " + encryptedDocument);

    messageToSend.encryptedDocument = encryptedDocument;

    // 5. Store the generated document key
    console.log("    adding document key to secret store..")
    let res = await ss.session.storeDocumentKey(docID, signedDocID, documentKey.common_point, documentKey.encrypted_point);
    console.log("Successful")
    fs.writeFileSync("./sent_message.json", JSON.stringify(messageToSend));
}

tutorialPart2();
