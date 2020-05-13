const fs = require("fs");
const path = require("path");

const REGISTRY = {
    73799: "0x6Bac866984eE3A5871b089292d07a531AcDbc40f"
}

const ACCOUNT_LOCAL = {
    ALICE: ["0x3144de21da6de18061f818836fa3db8f3d6b6989", fs.readFileSync(path.join(__dirname, "nodes_ss_localpoa", "alice.pwd"), "utf-8")],
    BOB: ["0x6c4b8b199a41b721e0a95df9860cf0a18732e76d", fs.readFileSync(path.join(__dirname, "nodes_ss_localpoa", "bob.pwd"), "utf-8")],
    CHARLIE: ["0x8b2c16e09bfb011c5e4883cedb105124ccf01af7", fs.readFileSync(path.join(__dirname, "nodes_ss_localpoa", "charlie.pwd"), "utf-8")]
}

const HTTP_RPC_LOCAL = {
    ALICE: "http://localhost:8545",
    BOB: "http://localhost:8547",
    CHARLIE: "http://localhost:8549"
}

const HTTP_SS_LOCAL = {
    ALICE: "http://127.0.0.1:8090",
    BOB: "http://127.0.0.1:8091",
    CHARLIE: "http://127.0.0.1:8092"
}


const HTTP_RPC_NETWORK = {
    73799: {
        1: "http://3.122.126.73:8545",
        2: "http://52.74.41.192:8545",
        3: "http://3.88.123.39:8545",
        4: "http://18.228.230.122:8545",
        5: "http://54.153.207.163:8545",
        6: "http://52.31.129.130:8545",
        7: "http://52.26.99.32:8545"
    }
}

const HTTP_SS_NETWORK = {
    73799: {
        1: "http://3.122.126.73:8082",
        2: "http://52.74.41.192:8082",
        3: "http://3.88.123.39:8082",
        4: "http://18.228.230.122:8082",
        5: "http://54.153.207.163:8082",
        6: "http://52.31.129.130:8082",
        7: "http://52.26.99.32:8082"
    }
}

const ACL_CONTRACT_NETWORK = {
    73799: "0x6Bac866984eE3A5871b089292d07a531AcDbc40f"
}

module.exports = {
    REGISTRY,
    ACCOUNT_LOCAL,
    HTTP_RPC_LOCAL,
    HTTP_SS_LOCAL,
    HTTP_RPC_NETWORK,
    HTTP_SS_NETWORK
}