var utils = require("../utils.js")
var fs = require("fs")

const accAlice = "0xaf198921d2fd9c4f0a294a774f7a2aea9aae0631"
const accBob = "0xcd2216eb651c37a0ea91ba27d784452870747aff"
const accCharlie = "0x7218a36efed0ab14a6295bb1c322ba1abbc4decf"

const pwdAlice = fs.readFileSync("../nodes_ss/alice.pwd", "utf-8")
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

const PrivateContract = artifacts.require("./PrivateContract.sol")
const TestContract = artifacts.require("./Test.sol")

const httpRPC="http://localhost:8545"

function setvalue() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("setting value in contract: " + contractAddress)
        const Web3 = require("web3")
        const web3 = new Web3(httpRPC)

        // we get the private contract instance
        const privateContract = new web3.eth.Contract(TestContract.abi, contractAddress)

        // 1. encode the transaction data: the function and params to pass
        const encodedData = yield privateContract.methods.setX(web3.utils.toHex("42")).encodeABI();
        console.log(encodedData)
        
        // this is another method for this
        //let jsoninterface = yield utils.getJSONInterface(web3, TestContract.abi, "function", "setX")
        //console.log(jsoninterface)
        //const encodedData = yield web3.eth.abi.encodeFunctionCall(jsoninterface, [web3.utils.toHex("42")])

        // nonce
        let nonce = web3.utils.toHex(yield web3.eth.getTransactionCount(accAlice))
        console.log(nonce)

        // 2. let's compose the transaction
        const composedTx = yield utils.composeTx(web3, 1000000, 100, accAlice, contractAddress, encodedData)
        console.log(composedTx)
        // 3. sign it by alice 
        const signedTx = yield web3.eth.personal.signTransaction(composedTx.result, pwdAlice)
        console.log(signedTx)

        // 4. transact
        const receipt = yield utils.privateSend(web3, signedTx.raw)
         
        // check the receipt if the transaction succeeded on blockexplorer
        console.log(receipt)
    });
};

module.exports = function(callback) {
    setvalue();
};
