const { executeQuery } = require('../database/connection');

/**
 * Cadastra um novo livro no banco de dados
 * @param {string} titulo - Título do livro
 * @param {string} isbn - ISBN do livro (único)
 * @param {number} anoPublicacao - Ano de publicação
 * @param {number} idEditora - ID da editora (referência estrangeira)
 * @returns {Promise<object>} Objeto com o resultado da inserção
 */
async function cadastrarLivro(titulo, isbn, anoPublicacao, idEditora) {
  try {
    // Validações básicas
    if (!titulo || typeof titulo !== 'string') {
      throw new Error('Título é obrigatório e deve ser uma string');
    }
    if (!isbn || typeof isbn !== 'string') {
      throw new Error('ISBN é obrigatório e deve ser uma string');
    }
    if (!anoPublicacao || typeof anoPublicacao !== 'number') {
      throw new Error('Ano de publicação é obrigatório e deve ser um número');
    }
    if (!idEditora || typeof idEditora !== 'number') {
      throw new Error('ID da editora é obrigatório e deve ser um número');
    }

    // Verifica se o ISBN já existe
    const livroExistente = await executeQuery(
      'SELECT idLivro FROM Livro WHERE isbn = ?',
      [isbn]
    );

    if (livroExistente.length > 0) {
      throw new Error(`Livro com ISBN ${isbn} já existe no banco de dados`);
    }

    // Verifica se a editora existe
    const editora = await executeQuery(
      'SELECT idEditora FROM Editora WHERE idEditora = ?',
      [idEditora]
    );

    if (editora.length === 0) {
      throw new Error(`Editora com ID ${idEditora} não encontrada`);
    }

    // Insere o novo livro
    const resultado = await executeQuery(
      'INSERT INTO Livro (titulo, isbn, anoPublicacao, idEditora) VALUES (?, ?, ?, ?)',
      [titulo, isbn, anoPublicacao, idEditora]
    );

    console.log(`✓ Livro "${titulo}" cadastrado com sucesso (ID: ${resultado.insertId})`);

    return {
      sucesso: true,
      idLivro: resultado.insertId,
      mensagem: `Livro cadastrado com sucesso`,
      livro: {
        idLivro: resultado.insertId,
        titulo,
        isbn,
        anoPublicacao,  
        idEditora
      }
    };
  } catch (error) {
    console.error('✗ Erro ao cadastrar livro:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Obtém todos os livros do banco de dados
 * @returns {Promise<array>} Array com todos os livros
 */
async function obterTodosLivros() {
  try {
    const livros = await executeQuery(
      `SELECT l.idLivro, l.titulo, l.isbn, l.anoPublicacao, 
              e.idEditora, e.nomeEditora
       FROM Livro l
       LEFT JOIN Editora e ON l.idEditora = e.idEditora
       ORDER BY l.titulo`
    );
    return livros;
  } catch (error) {
    console.error('✗ Erro ao obter livros:', error.message);
    throw error;
  }
}

/**
 * Obtém um livro específico pelo ID
 * @param {number} idLivro - ID do livro
 * @returns {Promise<object>} Objeto com os dados do livro
 */
async function obterLivroPorId(idLivro) {
  try {
    const livro = await executeQuery(
      `SELECT l.idLivro, l.titulo, l.isbn, l.anoPublicacao, 
              e.idEditora, e.nomeEditora
       FROM Livro l
       LEFT JOIN Editora e ON l.idEditora = e.idEditora
       WHERE l.idLivro = ?`,
      [idLivro]
    );

    if (livro.length === 0) {
      throw new Error(`Livro com ID ${idLivro} não encontrado`);
    }

    return livro[0];
  } catch (error) {
    console.error('✗ Erro ao obter livro:', error.message);
    throw error;
  }
}

/**
 * Atualiza os dados de um livro
 * @param {number} idLivro - ID do livro
 * @param {object} dados - Objeto com os dados a atualizar
 * @returns {Promise<object>} Resultado da atualização
 */
async function atualizarLivro(idLivro, dados) {
  try {
    if (!idLivro) {
      throw new Error('ID do livro é obrigatório');
    }

    const atualizacoes = [];
    const valores = [];

    if (dados.titulo !== undefined) {
      atualizacoes.push('titulo = ?');
      valores.push(dados.titulo);
    }
    if (dados.isbn !== undefined) {
      atualizacoes.push('isbn = ?');
      valores.push(dados.isbn);
    }
    if (dados.anoPublicacao !== undefined) {
      atualizacoes.push('anoPublicacao = ?');
      valores.push(dados.anoPublicacao);
    }
    if (dados.idEditora !== undefined) {
      atualizacoes.push('idEditora = ?');
      valores.push(dados.idEditora);
    }

    if (atualizacoes.length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    valores.push(idLivro);

    const resultado = await executeQuery(
      `UPDATE Livro SET ${atualizacoes.join(', ')} WHERE idLivro = ?`,
      valores
    );

    console.log(`✓ Livro com ID ${idLivro} atualizado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Livro atualizado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao atualizar livro:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Deleta um livro do banco de dados
 * @param {number} idLivro - ID do livro
 * @returns {Promise<object>} Resultado da exclusão
 */
async function deletarLivro(idLivro) {
  try {
    if (!idLivro) {
      throw new Error('ID do livro é obrigatório');
    }

    // Verifica se o livro existe
    const livro = await obterLivroPorId(idLivro);

    // Deleta associações em LivroAutor primeiro (integridade referencial)
    await executeQuery('DELETE FROM LivroAutor WHERE idLivro = ?', [idLivro]);

    // Deleta empréstimos do livro
    await executeQuery('DELETE FROM Emprestimo WHERE idLivro = ?', [idLivro]);

    // Deleta o livro
    const resultado = await executeQuery(
      'DELETE FROM Livro WHERE idLivro = ?',
      [idLivro]
    );

    console.log(`✓ Livro "${livro.titulo}" deletado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Livro deletado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao deletar livro:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

module.exports = {
  cadastrarLivro,
  obterTodosLivros,
  obterLivroPorId,
  atualizarLivro,
  deletarLivro
};
