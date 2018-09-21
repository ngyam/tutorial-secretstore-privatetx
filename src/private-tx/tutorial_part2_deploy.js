const utils = require("../utils.js");
const fs = require("fs");
const path = require("path");

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();
const { httpSSAlice, httpSSBob, httpSSCharlie } = utils.connectionsHTTPSS();

const TestContract = require(path.join(__dirname, "../../build/contracts/Test.json"));

function tutorialPart2() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("Tutorial part 2 - deploying secret contract");
        const web3 = new (require("web3"))(httpRpcAlice);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);

        // 1. Get the secret contract's bytecode -> done: TestContract.bytecode


        // 2. Compose and sign the deployment transaction

        // 2.1 Compose
        const deploymentTx = yield utils.composeTx(web3, 1000000, 1000, alice, null, TestContract.bytecode);  // I spared no expense
        console.log("Composed deployment transaction:" + JSON.stringify(deploymentTx));

        // 2. Sign
        const signedDeplTx = yield web3.eth.personal.signTransaction(deploymentTx, alicepwd);
        console.log("Signed deployment transaction:" + JSON.stringify(signedDeplTx));


        // 3. Encrypt and broadcast the deployment transaction

        // 3.1 Encrypt the deployment transaction for the validators
        const encryptedDeploymentTx = yield utils.privateComposeDeploymentTx(web3, signedDeplTx.raw, [bob], web3.utils.toHex(web3.utils.toWei('0.005', "ether")));
        console.log("Private composed tx: " + JSON.stringify(encryptedDeploymentTx.transaction));

        // 3.1.1 We save the public contract address
        const composeReceipt = encryptedDeploymentTx.receipt;
        console.log("Private composed tx receipt: " + JSON.stringify(composeReceipt));
        
        fs.writeFileSync("./compose_receipt.json", JSON.stringify(composeReceipt));

        // 3.2 Sign and broadcast the deployment transaction

        // 3.2.1 Sign again
        const finalTx = yield web3.eth.personal.signTransaction(encryptedDeploymentTx.transaction, alicepwd);
        console.log("Signed transaction: " + JSON.stringify(finalTx.tx));

        // 3.2.2 Broadcast
        const receipt = yield utils.sendRawTx(web3, finalTx.raw);
        
        // check the receipt if the deployment succeeded on blockexplorer
        console.log("receipt: " + receipt);
    });
};

tutorialPart2();
