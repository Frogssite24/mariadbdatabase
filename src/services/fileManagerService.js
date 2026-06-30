const fs = require('fs');
const file_name = './arquivos/myText.txt';

function criarArquivo(){
fs.writeFileSync(file_name, 'texto');

}

function leArquivo(){
    return fs.readFileSync(file_name);
}

module.exports = {criarArquivo, leArquivo}; 