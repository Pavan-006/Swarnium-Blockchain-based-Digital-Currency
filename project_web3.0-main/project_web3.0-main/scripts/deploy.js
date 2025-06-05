async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Swarnium = await ethers.getContractFactory("Swarnium");
  const swarnium = await Swarnium.deploy();

  await swarnium.deployed();

  console.log("Swarnium contract deployed to:", swarnium.address);
  
  // Save the contract address
  const fs = require("fs");
  const contractsDir = __dirname + "/../client/src/utils";
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contracts.js",
    `export const CONTRACT_ADDRESS = "${swarnium.address}";
export const SWARNIUM_ABI = ${JSON.stringify(JSON.parse(swarnium.interface.format('json')), null, 2)};
`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 