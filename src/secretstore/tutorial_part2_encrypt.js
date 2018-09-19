const utils = require("../utils.js");
const fs = require("fs");

const httpRPC="http://localhost:8545";
const httpSS="http://127.0.0.1:8090";

const document = "mySecretDocument";

function tutorialPart2() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        const Web3 = require("web3");
        const web3 = new Web3(httpRPC);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);

        let messageToSend = {}

        // 1. we generate a hash of the document name as the document ID
        const docID = yield utils.getSHA256hash(document);
        console.log("doc ID: " + docID);

        messageToSend.docID = docID;

        // 2.1 we sign the document key id
        const signedDocID = yield utils.ssSignRawHash(web3, alice, alicepwd, docID);
        console.log("signed doc ID: " + signedDocID);

        // 2.2 we generate the secret store server key
        let ssServerKey
        try {
            // threshold is chosen to be 1 like in the official tutorial
            ssServerKey = yield utils.ssGenerateServerKey(httpSS, docID, signedDocID.slice(2), 1);
        } catch(error) {
            if (error instanceof utils.SSRequestError && error.response.body === '"\\"Server key with this ID is already generated\\""') {
                ssServerKey = yield utils.ssGetServerKey(httpSS, docID, signedDocID.slice(2));
            }   
            else {
                // let it rip
                throw error;
            }
        }
        console.log("server key public part: " + ssServerKey);

        // 3. Generate document key
        const documentKey = yield utils.ssGenDocKey(web3, alice, alicepwd, ssServerKey);
        console.log(documentKey);

        // 4.-1 the document in hex format
        const hexDocument = web3.utils.toHex(document);
        console.log("hex document: " + hexDocument);
        
        // 4. Document encryption
        const encryptedDocument = yield utils.ssEncrypt(web3, alice, alicepwd,documentKey.encrypted_key, hexDocument);
        console.log("encrypted secret document: " + encryptedDocument);

        messageToSend.encryptedDocument = encryptedDocument;

        // 5. Store the generated document key
        let res = yield utils.ssStoreDocKey(httpSS, docID, signedDocID, documentKey.common_point, documentKey.encrypted_point);
        console.log(res);

        fs.writeFileSync("./sent_message.json", JSON.stringify(messageToSend));

    });
}

tutorialPart2();
