const utils = require("../utils.js");
const fs = require("fs");

const secretstore = require("secretstore");

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();
const { httpSSAlice, httpSSBob, httpSSCharlie } = utils.connectionsHTTPSS();

const document = "mySecretDocument";

function tutorialPart2() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const Web3 = require("web3");
        const web3 = new Web3(httpRpcAlice);
        const ss = new secretstore.SecretStore(web3, httpSSAlice);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);

        let messageToSend = {}

        // 1. we generate a hash of the document name as the document ID
        const docID = yield utils.getSHA256hash(document);
        console.log("doc ID: " + docID);

        messageToSend.docID = docID;

        // 2.1 we sign the document key id
        const signedDocID = yield ss.signRawHash(alice, alicepwd, docID);
        console.log("signed doc ID: " + signedDocID);

        // 2.2 we generate the secret store server key
        let serverKey
        try {
            // threshold is chosen to be 1 like in the official tutorial
            serverKey = yield ss.session.generateServerKey(docID, signedDocID, 1);
        } catch(error) {
            if (error instanceof secretstore.SecretStoreSessionError 
                && error.response.body === '"\\"Server key with this ID is already generated\\""') {
                console.log("Erase SS database or use the existing one.")
                throw error;
            }   
            throw error;
        }
        console.log("Server key public part: " + JSON.stringify(serverKey));

        // 3. Generate document key
        const documentKey = yield ss.generateDocumentKey(alice, alicepwd, serverKey);
        console.log("Document key" + JSON.stringify(documentKey));

        // 4.-1 the document in hex format
        const hexDocument = web3.utils.toHex(document);
        console.log("Hex document: " + hexDocument);
        
        // 4. Document encryption
        const encryptedDocument = yield ss.encrypt(alice, alicepwd, documentKey.encrypted_key, hexDocument);
        console.log("Encrypted secret document: " + encryptedDocument);

        messageToSend.encryptedDocument = encryptedDocument;

        // 5. Store the generated document key
        let res = yield ss.session.storeDocumentKey(docID, signedDocID, documentKey.common_point, documentKey.encrypted_point);

        fs.writeFileSync("./sent_message.json", JSON.stringify(messageToSend));
    });
}

tutorialPart2();
