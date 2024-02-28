/*
 * Usage: npm run set:keystore wallets.txt
 */

const fs = require('fs');
const readline = require('readline');

// Retrieve the file path from command-line arguments
const walletsFilePath = process.argv[2];

if (!walletsFilePath) {
  console.log("Please provide the path to the wallets.txt file as a command-line argument.");
  process.exit(1);
}

function main() {
  const fileStream = fs.createReadStream(walletsFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let currentSection = '';
  let keystore = '';

  rl.on('line', (line) => {
    if (line.startsWith('##')) {
      // When a new section starts, process the previous section
      if (keystore) {
        // Write the keystore to the appropriate file based on the previous section
        writeFileBasedOnSection(currentSection, keystore);
        keystore = ''; // Reset keystore for the next section
      }
      currentSection = line.substring(3).trim(); // Remove "## " to get the section name
    } else if (line.startsWith('keystore:')) {
      keystore = line.substring('keystore:'.length).trim();
    }
  }).on('close', () => {
    // Handle the last section
    if (keystore) {
      writeFileBasedOnSection(currentSection, keystore);
    }
  });
}

function writeFileBasedOnSection(section, keystoreData) {
  let filename;
  switch (section) {
    case 'Trusted sequencer':
      filename = 'config/node/sequencer.keystore';
      break;
    case 'Trusted aggregator':
      filename = 'config/node/aggregator.keystore';
      break;
    case 'DAC member':
      filename = 'config/dac/dac-member.keystore';
      break;
    case 'Claim tx manager':
      filename = 'config/bridge/claimtx.keystore';
      break;
    // Add more cases as needed
    default:
      console.log(`Unknown section: ${section}`);
      return;
  }
  fs.writeFileSync(filename, keystoreData);
  console.log(`Written keystore to ${filename}`);
}

if (require.main === module) {
  main();
}
