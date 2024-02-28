const fs = require('fs');
require('dotenv').config();

// Function to read JSON file
function readJSONFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function updateDockerCompose(deployOutput, genesisConfig, configTomlPath) {
    const deployData = readJSONFile(deployOutput);
    const genesisData = readJSONFile(genesisConfig);
    let configContent = fs.readFileSync(configTomlPath, 'utf8');

    configContent = configContent.replace(/(ETHEREUM_BRIDGE_CONTRACT_ADDRESS=).*/, `$1${deployData.polygonZkEVMBridgeAddress}`);
    configContent = configContent.replace(/(ETHEREUM_PROOF_OF_EFFICIENCY_CONTRACT_ADDRESS=).*/, `$1${deployData.cdkValidiumAddress}`);

    // Find the address for "PolygonZkEVMBridge proxy" in genesis.config.json
    const bridgeProxy = genesisData.genesis.find(item => item.contractName === "PolygonZkEVMBridge proxy");
    if (bridgeProxy) {
        // Update L2PolygonBridgeAddresses
        configContent = configContent.replace(/(POLYGON_ZK_EVM_BRIDGE_CONTRACT_ADDRESS=).*/, `$1${bridgeProxy.address}`);
    }

    fs.writeFileSync(configTomlPath, configContent, 'utf8');
}

const deployOutputPath = './deploy_output.json';
const genesisConfigPath = './config/node/genesis.config.json';
const dockerComposePath = './docker-compose.yml';

// Update the config.toml file
if (require.main === module) {
  updateDockerCompose(deployOutputPath, genesisConfigPath, dockerComposePath);
}