const fs = require('fs');
require('dotenv').config();

// Function to read JSON file
function readJSONFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function replaceKeystorePassword(configContent) {
    const password = process.env.KEYSTORE_PASSWORD;
    if (password) {
        const passwordRegex = /(\s*Password\s*=\s*)"testonly"/g;
        configContent = configContent.replace(passwordRegex, `$1"${password}"`);
    } else {
        console.warn('Warning: KEYSTORE_PASSWORD not found in .env');
    }
    return configContent;
}

function updateBridgeConfigToml(deployOutput, genesisConfig, configTomlPath) {
    const deployData = readJSONFile(deployOutput);
    const genesisData = readJSONFile(genesisConfig);
    let configContent = fs.readFileSync(configTomlPath, 'utf8');

    configContent = configContent.replace(/(GenBlockNumber\s*=\s*)\d+/, `$1${deployData.deploymentBlockNumber}`);
    configContent = configContent.replace(/(PolygonBridgeAddress\s*=\s*)".*"/, `$1"${deployData.polygonZkEVMBridgeAddress}"`);
    configContent = configContent.replace(/(PolygonZkEVMGlobalExitRootAddress\s*=\s*)".*"/, `$1"${deployData.polygonZkEVMGlobalExitRootAddress}"`);
    configContent = configContent.replace(/(L1URL\s*=\s*)".*"/, `$1"${process.env.L1_RPC_URL}"`);

    // Find the address for "PolygonZkEVMBridge proxy" in genesis.config.json
    const bridgeProxy = genesisData.genesis.find(item => item.contractName === "PolygonZkEVMBridge proxy");
    if (bridgeProxy) {
        // Update L2PolygonBridgeAddresses
        configContent = configContent.replace(/(L2PolygonBridgeAddresses\s*=\s*)\[".*"\]/, `$1["${bridgeProxy.address}"]`);
    }

    configContent = replaceKeystorePassword(configContent);

    fs.writeFileSync(configTomlPath, configContent, 'utf8');
}

function updateDACConfigToml(deployOutput, configTomlPath) {
    const deployData = readJSONFile(deployOutput);
    let configContent = fs.readFileSync(configTomlPath, 'utf8');

    configContent = configContent.replace(/(CDKValidiumAddress\s*=\s*)".*"/, `$1"${deployData.cdkValidiumAddress}"`);
    configContent = configContent.replace(/(DataCommitteeAddress\s*=\s*)".*"/, `$1"${deployData.cdkDataCommitteeContract}"`);
    configContent = configContent.replace(/(RpcURL\s*=\s*)".*"/, `$1"${process.env.L1_RPC_URL}"`);
    configContent = configContent.replace(/(WsURL\s*=\s*)".*"/, `$1"${process.env.L1_WS_RPC_URL}"`);

    configContent = replaceKeystorePassword(configContent);

    fs.writeFileSync(configTomlPath, configContent, 'utf8');
}

function updateNodeConfigToml(deployOutput, configTomlPath) {
    const deployData = readJSONFile(deployOutput);
    let configContent = fs.readFileSync(configTomlPath, 'utf8');

    configContent = configContent.replace(/(L2Coinbase\s*=\s*)".*"/, `$1"${deployData.trustedSequencer}"`);
    configContent = configContent.replace(/(SenderAddress\s*=\s*)".*"/, `$1"${deployData.trustedAggregator}"`);
    configContent = configContent.replace(/(URL\s*=\s*)"http:\/\/zkevm-mock-l1-network:8545"/, `$1"${process.env.L1_RPC_URL}"`);

    configContent = replaceKeystorePassword(configContent);

    fs.writeFileSync(configTomlPath, configContent, 'utf8');
}

const deployOutputPath = './deploy_output.json';
const genesisConfigPath = './config/node/genesis.config.json';
const bridgeConfigTomlPath = './config/bridge/config.toml';
const dacConfigTomlPath = './config/dac/config.toml';
const nodeConfigTomlPath = './config/node/config.toml';

// Update the config.toml file
if (require.main === module) {
  updateBridgeConfigToml(deployOutputPath, genesisConfigPath, bridgeConfigTomlPath);
  updateDACConfigToml(deployOutputPath, dacConfigTomlPath);
  updateNodeConfigToml(deployOutputPath, nodeConfigTomlPath);
}