const fs = require("fs");
const path = require("path");
const private = require("secretstore-private-js").private;

const utils = require("../utils.js");

const consumptionContract = require(path.join(__dirname, "../../build/contracts/Consumption.json"));
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();

    function retrieveConsumption() {
        return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("Charlie attempt to retrieve Alice consumption");
        const web3 = new (require("web3"))(httpRpcAlice);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);

        // we get the private contract instance
        const privateContract = new web3.eth.Contract(consumptionContract.abi, contractAddress);

        // get the nonce
        let nonce = web3.utils.toHex((yield web3.eth.getTransactionCount(alice)));

        // encode the transaction data: the function signature and params to pass
        const encodedData = privateContract.methods.retrieveConsumption(alice,"20180101", 0).encodeABI();
        console.log(web3.utils.sha3("20180101"));
        console.log("Calldata: " + encodedData);
        const callRes = yield private.call(web3, {from: alice, to: contractAddress, data: encodedData, nonce: nonce});
        console.log("Answer:");
        console.log(callRes);
    });
};

retrieveConsumption();
