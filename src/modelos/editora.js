const { executeQuery } = require('../database/connection');

/**
 * Cadastra uma nova editora no banco de dados
 * @param {string} nomeEditora - Nome da editora
 * @returns {Promise<object>} Objeto com o resultado da inserção
 */
async function cadastrarEditora(nomeEditora) {
  try {
    if (!nomeEditora || typeof nomeEditora !== 'string') {
      throw new Error('Nome da editora é obrigatório e deve ser uma string');
    }

    const editoraExistente = await executeQuery(
      'SELECT idEditora FROM Editora WHERE nomeEditora = ?',
      [nomeEditora]
    );

    if (editoraExistente.length > 0) {
      throw new Error(`Editora "${nomeEditora}" já existe no banco de dados`);
    }

    const resultado = await executeQuery(
      'INSERT INTO Editora (nomeEditora) VALUES (?)',
      [nomeEditora]
    );

    console.log(`✓ Editora "${nomeEditora}" cadastrada com sucesso (ID: ${resultado.insertId})`);

    return {
      sucesso: true,
      idEditora: resultado.insertId,
      mensagem: 'Editora cadastrada com sucesso',
      editora: {
        idEditora: resultado.insertId,
        nomeEditora
      }
    };
  } catch (error) {
    console.error('✗ Erro ao cadastrar editora:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Obtém todas as editoras do banco de dados
 * @returns {Promise<array>} Array com todas as editoras
 */
async function obterTodasEditoras() {
  try {
    const editoras = await executeQuery(
      'SELECT idEditora, nomeEditora FROM Editora ORDER BY nomeEditora'
    );
    return editoras;
  } catch (error) {
    console.error('✗ Erro ao obter editoras:', error.message);
    throw error;
  }
}

/**
 * Obtém uma editora específica pelo ID
 * @param {number} idEditora - ID da editora
 * @returns {Promise<object>} Objeto com os dados da editora
 */
async function obterEditoraPorId(idEditora) {
  try {
    const editora = await executeQuery(
      'SELECT idEditora, nomeEditora FROM Editora WHERE idEditora = ?',
      [idEditora]
    );

    if (editora.length === 0) {
      throw new Error(`Editora com ID ${idEditora} não encontrada`);
    }

    return editora[0];
  } catch (error) {
    console.error('✗ Erro ao obter editora:', error.message);
    throw error;
  }
}

/**
 * Atualiza os dados de uma editora
 * @param {number} idEditora - ID da editora
 * @param {object} dados - Objeto com os dados a atualizar
 * @returns {Promise<object>} Resultado da atualização
 */
async function atualizarEditora(idEditora, dados) {
  try {
    if (!idEditora) {
      throw new Error('ID da editora é obrigatório');
    }

    const atualizacoes = [];
    const valores = [];

    if (dados.nomeEditora !== undefined) {
      atualizacoes.push('nomeEditora = ?');
      valores.push(dados.nomeEditora);
    }

    if (atualizacoes.length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    valores.push(idEditora);

    await executeQuery(
      `UPDATE Editora SET ${atualizacoes.join(', ')} WHERE idEditora = ?`,
      valores
    );

    console.log(`✓ Editora com ID ${idEditora} atualizada com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Editora atualizada com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao atualizar editora:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Deleta uma editora do banco de dados
 * @param {number} idEditora - ID da editora
 * @returns {Promise<object>} Resultado da exclusão
 */
async function deletarEditora(idEditora) {
  try {
    if (!idEditora) {
      throw new Error('ID da editora é obrigatório');
    }

    const editora = await obterEditoraPorId(idEditora);

    const livrosComEditora = await executeQuery(
      'SELECT idLivro FROM Livro WHERE idEditora = ?',
      [idEditora]
    );

    if (livrosComEditora.length > 0) {
      throw new Error('Não é possível deletar editora com livros vinculados');
    }

    await executeQuery('DELETE FROM Editora WHERE idEditora = ?', [idEditora]);

    console.log(`✓ Editora "${editora.nomeEditora}" deletada com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Editora deletada com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao deletar editora:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

module.exports = {
  cadastrarEditora,
  obterTodasEditoras,
  obterEditoraPorId,
  atualizarEditora,
  deletarEditora
};
