var utils = require("../utils.js")
var fs = require("fs")

const accAlice = "0xaf198921d2fd9c4f0a294a774f7a2aea9aae0631"

const pwdAlice = fs.readFileSync("../nodes_ss/alice.pwd", "utf-8")
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

const PrivateContract = artifacts.require("./PrivateContract.sol")
const TestContract = artifacts.require("./Test.sol")

const httpRPC="http://localhost:8545"

function checkValue() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("checking value of x")
        const Web3 = require("web3")
        const web3 = new Web3(httpRPC)

        // get the nonce
        let nonce = web3.utils.toHex((yield web3.eth.getTransactionCount(accAlice)))

        // we get the private contract instance
        const privateContract = new web3.eth.Contract(TestContract.abi, contractAddress)

        // encode the transaction data: the function signature and params to pass
        const encodedData = privateContract.methods.x().encodeABI()
        console.log("calldata: " + encodedData)
        console.log("nonce: " + nonce)

        const callRes = yield utils.privateCall(web3, {from:accAlice, to:contractAddress, data:encodedData, nonce: nonce})
        console.log("answer:")
        console.log(callRes);
    });
};

module.exports = function(callback) {
    checkValue();
};
