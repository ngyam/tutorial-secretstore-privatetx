var PrivateContract = artifacts.require("./PrivateContract.sol");
var PrivateContract = artifacts.require("./SSPermissions")

const path = require("path");
const utils = require(path.join(__dirname, "../src/utils.js"));

module.exports = async function(deployer, network, accounts) {

  console.log(provider);

  const { alice, bob, charlie } = await utils.accounts(web3);
  const { alicepwd, bobpwd, charliepwd } = await utils.passwords(web3);
  
  if (network==="tobalaba") {
    //deployer.deploy()
  } else {
    //deployer.deploy();
  }
};
