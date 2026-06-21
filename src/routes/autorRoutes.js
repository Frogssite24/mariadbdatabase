const express = require('express');
const router = express.Router();
const {
  cadastrarAutor,
  obterTodosAutores,
  obterAutorPorId,
  atualizarAutor,
  deletarAutor
} = require('../modelos/autor');

/**
 * POST /
 * Cria um novo autor
 * Body: { nomeAutor: string }
 */
router.post('/', async (req, res) => {
  try {
    const { nomeAutor } = req.body;

    if (!nomeAutor) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome do autor é obrigatório'
      });
    }

    const resultado = await cadastrarAutor(nomeAutor);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro POST /autores:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar autor',
      detalhes: error.message
    });
  }
});

/**
 * GET /
 * Lista todos os autores
 */
router.get('/', async (req, res) => {
  try {
    const autores = await obterTodosAutores();

    return res.status(200).json({
      sucesso: true,
      total: autores.length,
      dados: autores
    });
  } catch (error) {
    console.error('Erro GET /autores:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar autores',
      detalhes: error.message
    });
  }
});

/**
 * GET /:id
 * Busca um autor pelo ID
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

    const autor = await obterAutorPorId(parseInt(id));

    return res.status(200).json({
      sucesso: true,
      dados: autor
    });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro GET /autores/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar autor',
      detalhes: error.message
    });
  }
});

/**
 * PUT /:id
 * Atualiza um autor
 * Body: { nomeAutor?: string }
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

    const resultado = await atualizarAutor(parseInt(id), dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro PUT /autores/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar autor',
      detalhes: error.message
    });
  }
});

/**
 * DELETE /:id
 * Deleta um autor
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

    const resultado = await deletarAutor(parseInt(id));

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
    console.error('Erro DELETE /autores/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar autor',
      detalhes: error.message
    });
  }
});

module.exports = router;
