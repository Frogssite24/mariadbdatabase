const { executeQuery } = require('../database/connection');

/**
 * Cadastra um novo usuário no banco de dados
 * @param {string} nomeUsuario - Nome do usuário
 * @param {string} email - Email do usuário
 * @returns {Promise<object>} Objeto com o resultado da inserção
 */
async function cadastrarUsuario(nomeUsuario, email) {
  try {
    if (!nomeUsuario || typeof nomeUsuario !== 'string') {
      throw new Error('Nome do usuário é obrigatório e deve ser uma string');
    }
    if (!email || typeof email !== 'string') {
      throw new Error('Email é obrigatório e deve ser uma string');
    }

    const usuarioExistente = await executeQuery(
      'SELECT idUsuario FROM Usuario WHERE email = ?',
      [email]
    );

    if (usuarioExistente.length > 0) {
      throw new Error(`Email "${email}" já está em uso`);
    }

    const resultado = await executeQuery(
      'INSERT INTO Usuario (nomeUsuario, email) VALUES (?, ?)',
      [nomeUsuario, email]
    );

    console.log(`✓ Usuário "${nomeUsuario}" cadastrado com sucesso (ID: ${resultado.insertId})`);

    return {
      sucesso: true,
      idUsuario: resultado.insertId,
      mensagem: 'Usuário cadastrado com sucesso',
      usuario: {
        idUsuario: resultado.insertId,
        nomeUsuario,
        email
      }
    };
  } catch (error) {
    console.error('✗ Erro ao cadastrar usuário:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Obtém todos os usuários do banco de dados
 * @returns {Promise<array>} Array com todos os usuários
 */
async function obterTodosUsuarios() {
  try {
    const usuarios = await executeQuery(
      'SELECT idUsuario, nomeUsuario, email FROM Usuario ORDER BY nomeUsuario'
    );
    return usuarios;
  } catch (error) {
    console.error('✗ Erro ao obter usuários:', error.message);
    throw error;
  }
}

/**
 * Obtém um usuário específico pelo ID
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise<object>} Objeto com os dados do usuário
 */
async function obterUsuarioPorId(idUsuario) {
  try {
    const usuario = await executeQuery(
      'SELECT idUsuario, nomeUsuario, email FROM Usuario WHERE idUsuario = ?',
      [idUsuario]
    );

    if (usuario.length === 0) {
      throw new Error(`Usuário com ID ${idUsuario} não encontrado`);
    }

    return usuario[0];
  } catch (error) {
    console.error('✗ Erro ao obter usuário:', error.message);
    throw error;
  }
}

/**
 * Atualiza os dados de um usuário
 * @param {number} idUsuario - ID do usuário
 * @param {object} dados - Objeto com os dados a atualizar
 * @returns {Promise<object>} Resultado da atualização
 */
async function atualizarUsuario(idUsuario, dados) {
  try {
    if (!idUsuario) {
      throw new Error('ID do usuário é obrigatório');
    }

    const atualizacoes = [];
    const valores = [];

    if (dados.nomeUsuario !== undefined) {
      atualizacoes.push('nomeUsuario = ?');
      valores.push(dados.nomeUsuario);
    }
    if (dados.email !== undefined) {
      atualizacoes.push('email = ?');
      valores.push(dados.email);
    }

    if (atualizacoes.length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    valores.push(idUsuario);

    await executeQuery(
      `UPDATE Usuario SET ${atualizacoes.join(', ')} WHERE idUsuario = ?`,
      valores
    );

    console.log(`✓ Usuário com ID ${idUsuario} atualizado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao atualizar usuário:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Deleta um usuário do banco de dados
 * @param {number} idUsuario - ID do usuário
 * @returns {Promise<object>} Resultado da exclusão
 */
async function deletarUsuario(idUsuario) {
  try {
    if (!idUsuario) {
      throw new Error('ID do usuário é obrigatório');
    }

    const usuario = await obterUsuarioPorId(idUsuario);

    const emprestimos = await executeQuery(
      'SELECT idEmprestimo FROM Emprestimo WHERE idUsuario = ?',
      [idUsuario]
    );

    if (emprestimos.length > 0) {
      throw new Error('Não é possível deletar usuário com empréstimos vinculados');
    }

    await executeQuery('DELETE FROM Usuario WHERE idUsuario = ?', [idUsuario]);

    console.log(`✓ Usuário "${usuario.nomeUsuario}" deletado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao deletar usuário:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

module.exports = {
  cadastrarUsuario,
  obterTodosUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  deletarUsuario
};
