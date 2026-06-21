const { executeQuery } = require('../database/connection');

/**
 * Cadastra um novo empréstimo no banco de dados
 * @param {number} idLivro - ID do livro emprestado
 * @param {number} idUsuario - ID do usuário que fez o empréstimo
 * @param {string} dataRetirada - Data de retirada do empréstimo
 * @param {string|null} dataDevolucao - Data de devolução (opcional)
 * @returns {Promise<object>} Objeto com o resultado da inserção
 */
async function cadastrarEmprestimo(idLivro, idUsuario, dataRetirada, dataDevolucao = null) {
  try {
    if (!idLivro || typeof idLivro !== 'number') {
      throw new Error('ID do livro é obrigatório e deve ser um número');
    }
    if (!idUsuario || typeof idUsuario !== 'number') {
      throw new Error('ID do usuário é obrigatório e deve ser um número');
    }
    if (!dataRetirada || typeof dataRetirada !== 'string') {
      throw new Error('Data de retirada é obrigatória e deve ser uma string');
    }

    const livro = await executeQuery(
      'SELECT idLivro, titulo FROM Livro WHERE idLivro = ?',
      [idLivro]
    );

    if (livro.length === 0) {
      throw new Error(`Livro com ID ${idLivro} não encontrado`);
    }

    const usuario = await executeQuery(
      'SELECT idUsuario, nomeUsuario FROM Usuario WHERE idUsuario = ?',
      [idUsuario]
    );

    if (usuario.length === 0) {
      throw new Error(`Usuário com ID ${idUsuario} não encontrado`);
    }

    const resultado = await executeQuery(
      'INSERT INTO Emprestimo (idLivro, idUsuario, dataRetirada, dataDevolucao) VALUES (?, ?, ?, ?)',
      [idLivro, idUsuario, dataRetirada, dataDevolucao]
    );

    console.log(`✓ Empréstimo cadastrado com sucesso (ID: ${resultado.insertId}) para o livro "${livro[0].titulo}"`);

    return {
      sucesso: true,
      idEmprestimo: resultado.insertId,
      mensagem: 'Empréstimo cadastrado com sucesso',
      emprestimo: {
        idEmprestimo: resultado.insertId,
        idLivro,
        idUsuario,
        nomeUsuario: usuario[0].nomeUsuario,
        dataRetirada,
        dataDevolucao
      }
    };
  } catch (error) {
    console.error('✗ Erro ao cadastrar empréstimo:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Obtém todos os empréstimos do banco de dados
 * @returns {Promise<array>} Array com todos os empréstimos
 */
async function obterTodosEmprestimos() {
  try {
    const emprestimos = await executeQuery(
      `SELECT e.idEmprestimo, e.idLivro, l.titulo AS nomeLivro,
              e.idUsuario, u.nomeUsuario, e.dataRetirada, e.dataDevolucao
       FROM Emprestimo e
       LEFT JOIN Livro l ON e.idLivro = l.idLivro
       LEFT JOIN Usuario u ON e.idUsuario = u.idUsuario
       ORDER BY e.dataRetirada DESC`
    );
    return emprestimos;
  } catch (error) {
    console.error('✗ Erro ao obter empréstimos:', error.message);
    throw error;
  }
}

/**
 * Obtém um empréstimo específico pelo ID
 * @param {number} idEmprestimo - ID do empréstimo
 * @returns {Promise<object>} Objeto com os dados do empréstimo
 */
async function obterEmprestimoPorId(idEmprestimo) {
  try {
    const emprestimo = await executeQuery(
      `SELECT e.idEmprestimo, e.idLivro, l.titulo AS nomeLivro,
              e.idUsuario, u.nomeUsuario, e.dataRetirada, e.dataDevolucao
       FROM Emprestimo e
       LEFT JOIN Livro l ON e.idLivro = l.idLivro
       LEFT JOIN Usuario u ON e.idUsuario = u.idUsuario
       WHERE e.idEmprestimo = ?`,
      [idEmprestimo]
    );

    if (emprestimo.length === 0) {
      throw new Error(`Empréstimo com ID ${idEmprestimo} não encontrado`);
    }

    return emprestimo[0];
  } catch (error) {
    console.error('✗ Erro ao obter empréstimo:', error.message);
    throw error;
  }
}

/**
 * Atualiza os dados de um empréstimo
 * @param {number} idEmprestimo - ID do empréstimo
 * @param {object} dados - Objeto com os dados a atualizar
 * @returns {Promise<object>} Resultado da atualização
 */
async function atualizarEmprestimo(idEmprestimo, dados) {
  try {
    if (!idEmprestimo) {
      throw new Error('ID do empréstimo é obrigatório');
    }

    const atualizacoes = [];
    const valores = [];

    if (dados.idLivro !== undefined) {
      if (typeof dados.idLivro !== 'number') {
        throw new Error('ID do livro deve ser um número');
      }
      atualizacoes.push('idLivro = ?');
      valores.push(dados.idLivro);
    }
    if (dados.idUsuario !== undefined) {
      if (typeof dados.idUsuario !== 'number') {
        throw new Error('ID do usuário deve ser um número');
      }

      const usuario = await executeQuery(
        'SELECT idUsuario FROM Usuario WHERE idUsuario = ?',
        [dados.idUsuario]
      );

      if (usuario.length === 0) {
        throw new Error(`Usuário com ID ${dados.idUsuario} não encontrado`);
      }

      atualizacoes.push('idUsuario = ?');
      valores.push(dados.idUsuario);
    }
    if (dados.dataRetirada !== undefined) {
      atualizacoes.push('dataRetirada = ?');
      valores.push(dados.dataRetirada);
    }
    if (dados.dataDevolucao !== undefined) {
      atualizacoes.push('dataDevolucao = ?');
      valores.push(dados.dataDevolucao);
    }

    if (atualizacoes.length === 0) {
      throw new Error('Nenhum dado para atualizar');
    }

    valores.push(idEmprestimo);

    await executeQuery(
      `UPDATE Emprestimo SET ${atualizacoes.join(', ')} WHERE idEmprestimo = ?`,
      valores
    );

    console.log(`✓ Empréstimo com ID ${idEmprestimo} atualizado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Empréstimo atualizado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao atualizar empréstimo:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

/**
 * Deleta um empréstimo do banco de dados
 * @param {number} idEmprestimo - ID do empréstimo
 * @returns {Promise<object>} Resultado da exclusão
 */
async function deletarEmprestimo(idEmprestimo) {
  try {
    if (!idEmprestimo) {
      throw new Error('ID do empréstimo é obrigatório');
    }

    const emprestimo = await obterEmprestimoPorId(idEmprestimo);

    await executeQuery('DELETE FROM Emprestimo WHERE idEmprestimo = ?', [idEmprestimo]);

    console.log(`✓ Empréstimo do livro "${emprestimo.nomeLivro}" para o usuário "${emprestimo.nomeUsuario}" deletado com sucesso`);
    return {
      sucesso: true,
      mensagem: 'Empréstimo deletado com sucesso'
    };
  } catch (error) {
    console.error('✗ Erro ao deletar empréstimo:', error.message);
    return {
      sucesso: false,
      erro: error.message
    };
  }
}

module.exports = {
  cadastrarEmprestimo,
  obterTodosEmprestimos,
  obterEmprestimoPorId,
  atualizarEmprestimo,
  deletarEmprestimo
};
