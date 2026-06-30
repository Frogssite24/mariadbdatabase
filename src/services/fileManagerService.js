const fs = require('fs');
const file_name = './arquivos/myText.txt';

function criarArquivo(){
fs.writeFileSync(file_name, 'texto');

}

function leArquivo(){
    let texto = fs.readFileSync(file_name);
    return texto.toString();
}

module.exports = {criarArquivo, leArquivo}; 