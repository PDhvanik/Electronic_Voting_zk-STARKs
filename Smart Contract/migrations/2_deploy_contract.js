const SecureVoting = artifacts.require("SecureVoting");

module.exports = async function (deployer) {
   const candidateNames = ["Alice", "Bob", "Charlie"];
   await deployer.deploy(SecureVoting, candidateNames);
};
