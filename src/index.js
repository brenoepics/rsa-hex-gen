import { generateKeyPairSync } from 'crypto';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();


function generateRSAKeyPair(bits = 1024) {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: bits,
    publicKeyEncoding: { format: 'jwk' },
    privateKeyEncoding: { format: 'jwk' }
  });

  return {
    publicKey: publicKey,
    privateKey: privateKey
  };
}

function convertToHex(data) {
  return Buffer.from(data, 'base64').toString('hex');
}

function createOutputFolderIfNotExists(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
}

function writeKeyDataToFile(outputPath, publicKeyHex, hex, privateKeyHex) {
  const logData = `enc.e=${publicKeyHex}\nenc.n=${hex}\nenc.d=${privateKeyHex}`;
  fs.writeFileSync(outputPath, logData);
  console.log(`Key data has been written to ${outputPath}`);
}

function main() {
  const { publicKey, privateKey } = generateRSAKeyPair();
  const publicKeyHex = convertToHex(publicKey.e);
  const hex = convertToHex(publicKey.n);
  const privateKeyHex = convertToHex(privateKey.d);

  const outputFolderPath = path.join(__dirname, 'output');
  createOutputFolderIfNotExists(outputFolderPath);

  const outputPath = path.join(outputFolderPath, 'output-hex.env');
  writeKeyDataToFile(outputPath, publicKeyHex, hex, privateKeyHex);
}

// Run the main function
main();

