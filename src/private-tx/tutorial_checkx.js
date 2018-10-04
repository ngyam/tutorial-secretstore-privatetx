const fs = require("fs");
const path = require("path");
const private = require("secretstore-private-js").private;

const utils = require("../utils.js");

const TestContract = require(path.join(__dirname, "../../build/contracts/Test.json"));
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();

function checkValue() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("Checking value of x..");
        const web3 = new (require("web3"))(httpRpcAlice);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);

        // get the nonce
        let nonce = web3.utils.toHex((yield web3.eth.getTransactionCount(alice)));

        // we get the private contract instance
        const privateContract = new web3.eth.Contract(TestContract.abi, contractAddress);

        // encode the transaction data: the function signature and params to pass
        const encodedData = privateContract.methods.x().encodeABI();
        console.log("Calldata: " + encodedData);
        console.log("Nonce: " + nonce);

        const callRes = yield private.call(web3, {from: alice, to: contractAddress, data: encodedData, nonce: nonce});
        console.log("Answer: ");
        console.log(callRes);
    });
};

checkValue();
