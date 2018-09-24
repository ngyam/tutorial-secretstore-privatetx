var utils = require("../utils.js")
var fs = require("fs")
const path = require("path");

const { httpRpcAlice, httpRpcBob, httpRpcCharlie } = utils.connectionsHTTPRPC();
const { httpSSAlice, httpSSBob, httpSSCharlie } = utils.connectionsHTTPSS();

const TestContract = require(path.join(__dirname, "../../build/contracts/Test.json"));
const contractAddress = JSON.parse(fs.readFileSync("./compose_receipt.json", "utf-8")).contractAddress

function tutorialPart4() {
    return utils.__awaiter(this, void 0, void 0, function* () {
        console.log("Private Tx tutorial part 3");
        console.log("Setting value in contract: " + contractAddress);
        const web3 = new (require("web3"))(httpRpcAlice);

        // Get the private contract instance
        const privateContract = new web3.eth.Contract(TestContract.abi, contractAddress);

        const {alice, bob, charlie} = yield utils.accounts(web3);
        const {alicepwd, bobpwd, charliepwd} = yield utils.passwords(web3);
        console.log(alice, alicepwd);
        

        // 1. Check X
        
        // encode the transaction data: the function signature and params to pass
        const getXData = privateContract.methods.x().encodeABI();
        
        let nonce = web3.utils.toHex(yield web3.eth.getTransactionCount(alice))
        const callRes = yield utils.privateCall(web3, {from:alice, to:contractAddress, data:getXData, nonce: nonce})
        console.log("Value of X before modification: " +  JSON.stringify(callRes));


        // 2. Change value of X

        // 2.1 Compose the transaction

        // Encode the transaction data: the function and params to pass
        const setXData = yield privateContract.methods.setX(web3.utils.toHex("42")).encodeABI();
        
        // this is another method for this
        //let jsoninterface = yield utils.getJSONInterface(web3, TestContract.abi, "function", "setX")
        //console.log(jsoninterface)
        //const encodedData = yield web3.eth.abi.encodeFunctionCall(jsoninterface, [web3.utils.toHex("42")])

        const composedTx = yield utils.composeTx(web3, 1000000, 100, alice, contractAddress, setXData);
        console.log("Composed transaction: " +  JSON.stringify(composedTx));
        
        // 2.2. Sign it by alice 
        const signedTx = yield web3.eth.personal.signTransaction(composedTx, alicepwd);
        console.log("Signed transaction: " +  JSON.stringify(signedTx));

        // 2.3. Send
        const receipt = yield utils.privateSend(web3, signedTx.raw);
         
        // check the receipt if the transaction succeeded on blockexplorer
        // Verify later manually that the value is set
        console.log(receipt)
    });
};

tutorialPart4();
