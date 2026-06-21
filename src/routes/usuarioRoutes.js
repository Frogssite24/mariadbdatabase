const express = require('express');
const router = express.Router();
const {
  cadastrarUsuario,
  obterTodosUsuarios,
  obterUsuarioPorId,
  atualizarUsuario,
  deletarUsuario
} = require('../modelos/usuario');

/**
 * POST /
 * Cria um novo usuário
 * Body: { nomeUsuario: string, email: string }
 */
router.post('/', async (req, res) => {
  try {
    const { nomeUsuario, email } = req.body;

    if (!nomeUsuario || !email) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome de usuário e email são obrigatórios'
      });
    }

    const resultado = await cadastrarUsuario(nomeUsuario, email);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro POST /usuarios:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar usuário',
      detalhes: error.message
    });
  }
});

/**
 * GET /
 * Lista todos os usuários
 */
router.get('/', async (req, res) => {
  try {
    const usuarios = await obterTodosUsuarios();

    return res.status(200).json({
      sucesso: true,
      total: usuarios.length,
      dados: usuarios
    });
  } catch (error) {
    console.error('Erro GET /usuarios:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar usuários',
      detalhes: error.message
    });
  }
});

/**
 * GET /:id
 * Busca um usuário pelo ID
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

    const usuario = await obterUsuarioPorId(parseInt(id));

    return res.status(200).json({
      sucesso: true,
      dados: usuario
    });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro GET /usuarios/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar usuário',
      detalhes: error.message
    });
  }
});

/**
 * PUT /:id
 * Atualiza um usuário
 * Body: { nomeUsuario?: string, email?: string }
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

    const resultado = await atualizarUsuario(parseInt(id), dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro PUT /usuarios/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar usuário',
      detalhes: error.message
    });
  }
});

/**
 * DELETE /:id
 * Deleta um usuário
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

    const resultado = await deletarUsuario(parseInt(id));

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
    console.error('Erro DELETE /usuarios/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar usuário',
      detalhes: error.message
    });
  }
});

module.exports = router;
