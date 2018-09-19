var utils = require("../utils.js")
var fs = require("fs")

const accAlice = "0xaf198921d2fd9c4f0a294a774f7a2aea9aae0631"
const accBob = "0xcd2216eb651c37a0ea91ba27d784452870747aff"
const accCharlie = "0x7218a36efed0ab14a6295bb1c322ba1abbc4decf"

const pwdAlice = fs.readFileSync("../nodes_ss/alice.pwd", "utf-8")

const PrivateContract = artifacts.require("./PrivateContract.sol")
const TestContract = artifacts.require("./Test.sol")

const httpRPC="http://localhost:8545"

function deployContract() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("deploying secret contract")
        const Web3 = require("web3")
        const web3 = new Web3(httpRPC)

        // 1. we compose the deployment transaction
        const deploymentTx = yield utils.composeTx(web3, 1000000, 1000, accAlice, null, TestContract.bytecode)  // I spared no expense
        //console.log(deploymentTx);

        // 2. we sign it by the deployer
        const signedDeplTx = yield web3.eth.personal.signTransaction(deploymentTx.result, pwdAlice)
        //console.log(signedDeplTx)

        // 3. encrypt deployment transaction for the validators, get the address of the public smart contract
        const encryptedDeploymentTx = yield utils.composePrivateDeploymentTx(web3, signedDeplTx.raw, [accAlice])
        //console.log(encryptedDeploymentTx.result.transaction)

        // 3.1 we save the pulic contract address
        const composeReceipt = encryptedDeploymentTx.result.receipt
        //console.log("receipt: " + composeReceipt)
        fs.writeFileSync("./compose_receipt.json", JSON.stringify(composeReceipt))

        // 4. sign it by alice again
        const finalTx = yield web3.eth.personal.signTransaction(encryptedDeploymentTx.result.transaction, pwdAlice)
        console.log(finalTx.tx)

        // 5. broadcast (deploy)
        const receipt = yield utils.sendRawTx(web3, finalTx.raw)
        
        // check the receipt if the deployment succeeded on blockexplorer
        console.log(receipt)

    });
};

module.exports = function(callback) {
    deployContract();
};
