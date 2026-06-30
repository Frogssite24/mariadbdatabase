const express = require('express');
const fileManager = require('../services/fileManagerService');
const router = express.Router();
const {
  cadastrarEditora,
  obterTodasEditoras,
  obterEditoraPorId,
  atualizarEditora,
  deletarEditora
} = require('../modelos/editora');

/**
 * POST /
 * Cria uma nova editora
 * Body: { nomeEditora: string }
 */
router.post('/', async (req, res) => {
  try {
    const { nomeEditora } = req.body;

    fileManager.criarArquivo(nomeEditora); 

    if (!nomeEditora) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Nome da editora é obrigatório'
      });
    }

    const resultado = await cadastrarEditora(nomeEditora);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro POST /editoras:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar editora',
      detalhes: error.message
    });
  }
});

/**
 * GET /
 * Lista todas as editoras
 */
router.get('/', async (req, res) => {
  try {
    const editoras = await obterTodasEditoras();
    const text = fileManager.leArquivo();
    return res.status(200).json({
      sucesso: true,
      total: editoras.length,
      dados: editoras,
      conteudoArquivo: text

    });
  } catch (error) {
    console.error('Erro GET /editoras:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar editoras',
      detalhes: error.message
    });
  }
});

/**
 * GET /:id
 * Busca uma editora pelo ID
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

    const editora = await obterEditoraPorId(parseInt(id));

    return res.status(200).json({
      sucesso: true,
      dados: editora
    });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro GET /editoras/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar editora',
      detalhes: error.message
    });
  }
});

/**
 * PUT /:id
 * Atualiza uma editora
 * Body: { nomeEditora?: string }
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

    const resultado = await atualizarEditora(parseInt(id), dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro PUT /editoras/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar editora',
      detalhes: error.message
    });
  }
});

/**
 * DELETE /:id
 * Deleta uma editora
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

    const resultado = await deletarEditora(parseInt(id));

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
    console.error('Erro DELETE /editoras/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar editora',
      detalhes: error.message
    });
  }
});

module.exports = router;
