const { executeQuery } = require('../database/connection');

/**
 * Cadastra um novo autor no banco de dados
 * @param {string} nomeAutor - Nome do autor
 * @returns {Promise<object>} Objeto com o resultado da inserção
 */
async function cadastrarAutor(nomeAutor) {
  try {
    if (!nomeAutor || typeof nomeAutor !== 'string') {
      throw new Error('Nome do autor é obrigatório e deve ser uma string');
    }

    const autorExistente = await executeQuery(
      'SELECT idAutor FROM Autor WHERE nomeAutor = ?',
      [nomeAutor]
    );

    if (autorExistente.length > 0) {
      throw new Error(`Autor "${nomeAutor}" já existe no banco de dados`);
    }

    const resultado = await executeQuery(
      'INSERT INTO Autor (nomeAutor) VALUES (?)',
      [nomeAutor]
    );

    console.log(`✓ Autor "${nomeAutor}" cadastrado com sucesso (ID: ${resultado.insertId})`);

    return {
      sucesso: true,
      idAutor: resultado.insertId,
      mensagem: 'Autor cadastrado com sucesso',
      autor: {
        idAutor: resultado.insertId,
        nomeAutor
      }
    };
  } catch (error) {
    console.error('✗ Erro ao cadastrar autor:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Obtém todos os autores do banco de dados
 * @returns {Promise<array>} Array com todos os autores
 */
async function obterTodosAutores() {
  try {
    const autores = await executeQuery(
      'SELECT idAutor, nomeAutor FROM Autor ORDER BY nomeAutor'
    );
    return autores;
  } catch (error) {
    console.error('✗ Erro ao obter autores:', error.message);
    throw error;
  }
}

/**
 * Obtém um autor específico pelo ID
 * @param {number} idAutor - ID do autor
 * @returns {Promise<object>} Objeto com os dados do autor
 */
async function obterAutorPorId(idAutor) {
  try {
    const autor = await executeQuery(
      'SELECT idAutor, nomeAutor FROM Autor WHERE idAutor = ?',
      [idAutor]
    );

    if (autor.length === 0) {
      throw new Error(`Autor com ID ${idAutor} não encontrado`);
    }

    return autor[0];
  } catch (error) {
    console.error('✗ Erro ao obter autor:', error.message);
    throw error;
  }
}

/**
 * Atualiza os dados de um autor
 * @param {number} idAutor - ID do autor
 * @param {object} dados - Objeto com os dados a atualizar
 * @returns {Promise<object>} Resultado da atualização
 */
async function atualizarAutor(idAutor, dados) {
  try {
    if (!idAutor) {
      throw new Error('ID do autor é obrigatório');
    }

    const atualizacoes = [];
    const valores = [];

    if (dados.nomeAutor !== undefined) {
      atualizacoes.push('nomeAutor = ?');
      valores.push(dados.nomeAutor);
    }

    if (atualizacoes.length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    valores.push(idAutor);

    await executeQuery(
      `UPDATE Autor SET ${atualizacoes.join(', ')} WHERE idAutor = ?`,
      valores
    );

    console.log(`✓ Autor com ID ${idAutor} atualizado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Autor atualizado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao atualizar autor:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Deleta um autor do banco de dados
 * @param {number} idAutor - ID do autor
 * @returns {Promise<object>} Resultado da exclusão
 */
async function deletarAutor(idAutor) {
  try {
    if (!idAutor) {
      throw new Error('ID do autor é obrigatório');
    }

    const autor = await obterAutorPorId(idAutor);

    await executeQuery('DELETE FROM LivroAutor WHERE idAutor = ?', [idAutor]);
    await executeQuery('DELETE FROM Autor WHERE idAutor = ?', [idAutor]);

    console.log(`✓ Autor "${autor.nomeAutor}" deletado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Autor deletado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao deletar autor:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

module.exports = {
  cadastrarAutor,
  obterTodosAutores,
  obterAutorPorId,
  atualizarAutor,
  deletarAutor
};
