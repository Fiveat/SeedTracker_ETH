// Importa el paquete HDWalletProvider para interactuar con wallets usando frases semilla o claves privadas
const HDWalletProvider = require('@truffle/hdwallet-provider');

// Importa la biblioteca Web3 para conectar y operar con la blockchain de Ethereum
const Web3 = require('web3');

// Importa la biblioteca BN para manejar grandes números usados en Ethereum
const BN = require('bn.js');

// Importa el módulo fs (File System) para manejar la lectura y escritura de archivos
const fs = require('fs');

// Clave de acceso para el servicio de Infura, necesario para conectarse a la red Ethereum
const infuraKey = "";


//
const i = 0;

// Función asíncrona para generar combinaciones de palabras únicas desde un archivo
async function generateCombination() {
  let lines = []; // Almacena las líneas del archivo leído
  try {
    // Lee el archivo 'seedeng.txt' y obtiene su contenido como texto
    const data = fs.readFileSync('seedeng.txt', 'utf8');
    // Divide el contenido en líneas
    lines = data.split('\n');
    // Filtra las líneas vacías
    lines = lines.filter(line => line !== '');
    // Mezcla las líneas aleatoriamente
    const shuffledLines = lines.sort(() => Math.random() - 0.5);

    let combination = ""; // Almacena la combinación resultante de palabras
    let uniqueWords = new Set(); // Conjunto para garantizar palabras únicas

    // Recorre las líneas mezcladas para extraer palabras únicas hasta tener 12
    for (let i = 0; i < shuffledLines.length && uniqueWords.size < 12; i++) {
      // Divide cada línea en palabras
      const words = shuffledLines[i].trim().split(" ");
      // Añade palabras únicas hasta obtener un total de 12
      for (let j = 0; j < words.length && uniqueWords.size < 12; j++) {
        const word = words[j].trim();
        if (word && !uniqueWords.has(word)) {
          uniqueWords.add(word); // Agrega la palabra al conjunto único
          combination += word + " "; // Agrega la palabra a la combinación
        }
      }
    }
    return combination.trim(); // Devuelve la combinación final como una cadena
  } catch (error) {
    console.error(error); // Muestra el error si ocurre
    throw new Error('Error while generating combination'); // Lanza un error en caso de fallo
  }
}

// Función asíncrona para verificar el saldo de una billetera en Ethereum
async function checkBalance() {
  let balance = 0; // Inicializa el saldo como 0

  // Bucle que se ejecuta hasta encontrar una billetera con saldo mayor a 0
  while (balance <= 0) {
    try {
      // Genera una combinación de palabras semilla
      const seedWords = await generateCombination();
      console.log(seedWords); // Imprime las palabras generadas

      // Crea un proveedor para la billetera usando las palabras semilla y la URL de Infura
      const provider = new HDWalletProvider(seedWords, `https://mainnet.infura.io/v3/${infuraKey}`);

      // Crea una instancia de Web3 con el proveedor
      const web3 = new Web3(provider);

      // Obtiene las cuentas asociadas a la billetera
      const accounts = await web3.eth.getAccounts();
      // Obtiene el saldo de la primera cuenta en Wei (la unidad mínima de Ethereum)
      balance = await web3.eth.getBalance(accounts[0]);

      // Muestra la dirección y el saldo de la cuenta en la consola
      console.log(`Address: ${accounts[0]}`);
      console.log(`Balance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH`);

      // Si el saldo es mayor a 0, guarda la información en el archivo 'dinero.txt'
      if (balance > 0) {
        const fileContent = `Seed Words: ${seedWords}\nAddress: ${accounts[0]}\nBalance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH\n\n`;
        fs.appendFileSync('dinero.txt', fileContent);
      }
      // Si el saldo es 0, guarda la información en el archivo 'TEST.txt'
      if (balance == 0) {
        const fileContent = `Seed Words: ${seedWords}\nAddress: ${accounts[0]}\nBalance: ${web3.utils.fromWei(new BN(balance), 'ether')} ETH\n\n`;
        fs.appendFileSync('TEST.txt', fileContent);
      }

    } catch (error) {
      console.error(error); // Muestra el error si ocurre
    }
  }
}

// Llama a la función checkBalance para iniciar el proceso
checkBalance();
