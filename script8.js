const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const BN = require('bn.js');
const fs = require('fs');

//const infuraKey = "5ec71206ebde46b19ab5eb20ceb59968";
const infuraKey = "c23eab25d6614a9e87a5ac018a854f75";
const i = 0;
async function generateCombination() {
  let lines = [];
  try {
    const data = fs.readFileSync('seedeng.txt', 'utf8');
    lines = data.split('\n');
    lines = lines.filter(line => line !== '');
    const shuffledLines = lines.sort(() => Math.random() - 0.5);
    let combination = "";
    let uniqueWords = new Set();
    for (let i = 0; i < shuffledLines.length && uniqueWords.size < 12; i++) {
      const words = shuffledLines[i].trim().split(" ");
      for (let j = 0; j < words.length && uniqueWords.size < 12; j++) {
        const word = words[j].trim();
        if (word && !uniqueWords.has(word)) {
          uniqueWords.add(word);
          combination += word + " ";
        }
      }
    }
    return combination.trim();
  } catch (error) {
    console.error(error);
    throw new Error('Error while generating combination');
  }
}

async function checkBalance() {
  let balance = 0;
  while (balance <= 0) {
    try {
      // Lee las palabras semilla combinadas en grupos de 12
      const seedWords = await generateCombination();
      console.log(seedWords);

      // Crea un proveedor utilizando las palabras semilla y la URL de Infura
      const provider = new HDWalletProvider(seedWords, `https://mainnet.infura.io/v3/${infuraKey}`);

      // Crea una instancia de Web3
      const web3 = new Web3(provider);

      // Obtiene la dirección y el saldo de la billetera
      const accounts = await web3.eth.getAccounts();
      balance = await web3.eth.getBalance(accounts[0]);
      console.log(`Address: ${accounts[0]}`);
      console.log(`Balance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH`);

      if (balance > 0) {
        const fileContent = `Seed Words: ${seedWords}\nAddress: ${accounts[0]}\nBalance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH\n\n`;
        fs.appendFileSync('dinero.txt', fileContent);
      }
      if (balance == 0) {
        const fileContent = `Seed Words: ${seedWords}\nAddress: ${accounts[0]}\nBalance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH\n\n`;
        fs.appendFileSync('TEST.txt', fileContent);
      }

    } catch (error) {
      console.error(error);
    }
  }
}

checkBalance();
