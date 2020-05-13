
#!/usr/bin/env bash

# installs this repo, MultiSigWallet and EWF system contracts
# default values should be for EWF mainnet

cdir="$( cd "$(dirname "$0")" ; pwd -P )"

CONTRACT_REPO_NAME=${CONTRACT_REPO_NAME:-"secretstore-contracts"}

echo "Compiling private tx contracts.."
cd "${cdir}/.."
npx truffle compile
echo "Compiling permissioning contracts.."
cd "${cdir}/../node_modules/${CONTRACT_REPO_NAME}"
npx truffle compile
echo "Compiling contracts done"
