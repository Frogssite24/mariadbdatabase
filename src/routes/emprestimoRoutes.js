const express = require('express');
const router = express.Router();
const {
  cadastrarEmprestimo,
  obterTodosEmprestimos,
  obterEmprestimoPorId,
  atualizarEmprestimo,
  deletarEmprestimo
} = require('../modelos/emprestimo');

/**
 * POST /
 * Cria um novo empréstimo
 * Body: { idLivro: number, idUsuario: number, dataRetirada: string, dataDevolucao?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { idLivro, idUsuario, dataRetirada, dataDevolucao } = req.body;

    if (!idLivro || !idUsuario || !dataRetirada) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID do livro, ID do usuário e data de retirada são obrigatórios'
      });
    }

    if (typeof idLivro !== 'number' || typeof idUsuario !== 'number') {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID do livro e ID do usuário devem ser números'
      });
    }

    const resultado = await cadastrarEmprestimo(
      idLivro,
      idUsuario,
      dataRetirada,
      dataDevolucao || null
    );

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro POST /emprestimos:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar empréstimo',
      detalhes: error.message
    });
  }
});

/**
 * GET /
 * Lista todos os empréstimos
 */
router.get('/', async (req, res) => {
  try {
    const emprestimos = await obterTodosEmprestimos();

    return res.status(200).json({
      sucesso: true,
      total: emprestimos.length,
      dados: emprestimos
    });
  } catch (error) {
    console.error('Erro GET /emprestimos:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar empréstimos',
      detalhes: error.message
    });
  }
});

/**
 * GET /:id
 * Busca um empréstimo pelo ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID deve ser um número válido'
      });
    }

    const emprestimo = await obterEmprestimoPorId(parseInt(id));

    return res.status(200).json({
      sucesso: true,
      dados: emprestimo
    });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro GET /emprestimos/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar empréstimo',
      detalhes: error.message
    });
  }
});

/**
 * PUT /:id
 * Atualiza um empréstimo
 * Body: { idLivro?: number, idUsuario?: number, dataRetirada?: string, dataDevolucao?: string }
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID deve ser um número válido'
      });
    }

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nenhum dado para atualizar'
      });
    }

    const resultado = await atualizarEmprestimo(parseInt(id), dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro PUT /emprestimos/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar empréstimo',
      detalhes: error.message
    });
  }
});

/**
 * DELETE /:id
 * Deleta um empréstimo
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'ID deve ser um número válido'
      });
    }

    const resultado = await deletarEmprestimo(parseInt(id));

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro DELETE /emprestimos/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar empréstimo',
      detalhes: error.message
    });
  }
});

module.exports = router;
