const fs = require("fs")
const path = require("path");
const private = require("secretstore-private-js").private;

const utils = require("../utils.js")

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();
const { httpSSAlice, httpSSBob, httpSSCharlie } = utils.connectionsHTTPSS();

const consumptionContract = require(path.join(__dirname, "../../build/contracts/Consumption.json"));
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

function authorize() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("Give access to CHarlie to Alice consumption data");
        console.log("Setting value in contract: " + contractAddress);
        const web3 = new (require("web3"))(httpRpcAlice);

        // Get the private contract instance
        const privateContract = new web3.eth.Contract(consumptionContract.abi, contractAddress);

        const { alice, bob, charlie } = yield utils.accounts(web3);
        const { alicepwd, bobpwd, charliepwd } = yield utils.passwords(web3);
        console.log(alice, alicepwd);


        // 2.1 Compose the transaction

        const authorizeData = yield privateContract.methods.consume(42,"20180101",0).encodeABI();

        const composedTx = yield private.composePublicTx(web3, {
            gas: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(100),
            from: alice, to: contractAddress, data: authorizeData
        });
        console.log("Composed transaction: " + JSON.stringify(composedTx));

        // 2.2. Sign it by alice
        const signedTx = yield web3.eth.personal.signTransaction(composedTx, alicepwd);
        console.log("Signed transaction: " + JSON.stringify(signedTx));

        // 2.3. Send
        const receipt = yield private.send(web3, signedTx.raw);

        // check the receipt if the transaction succeeded on blockexplorer
        // Verify later manually that the value is set
        console.log(receipt);
    });
};

authorize();
