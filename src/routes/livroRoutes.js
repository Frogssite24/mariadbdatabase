const express = require('express');
const router = express.Router();
const {
  cadastrarLivro,
  obterTodosLivros,
  obterLivroPorId,
  atualizarLivro,
  deletarLivro
} = require('../modelos/livro');

/**
 * POST /
 * Cria um novo livro
 * Body: { titulo: string, isbn: string, anoPublicacao: number, idEditora: number }
 */
router.post('/', async (req, res) => {
  try {
    const { titulo, isbn, anoPublicacao, idEditora } = req.body;

    if (!titulo || !isbn || !anoPublicacao || !idEditora) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Título, ISBN, ano de publicação e ID da editora são obrigatórios'
      });
    }

    if (typeof anoPublicacao !== 'number' || typeof idEditora !== 'number') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Ano de publicação e ID da editora devem ser números'
      });
    }

    const resultado = await cadastrarLivro(titulo, isbn, anoPublicacao, idEditora);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro POST /livros:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao criar livro',
      detalhes: error.message
    });
  }
});

/**
 * GET /
 * Lista todos os livros
 */
router.get('/', async (req, res) => {
  try {
    const livros = await obterTodosLivros();

    return res.status(200).json({
      sucesso: true,
      total: livros.length,
      dados: livros
    });
  } catch (error) {
    console.error('Erro GET /livros:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao listar livros',
      detalhes: error.message
    });
  }
});

/**
 * GET /:id
 * Busca um livro pelo ID
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

    const livro = await obterLivroPorId(parseInt(id));

    return res.status(200).json({
      sucesso: true,
      dados: livro
    });
  } catch (error) {
    if (error.message.includes('não encontrado')) {
      return res.status(404).json({
        sucesso: false,
        erro: error.message
      });
    }
    console.error('Erro GET /livros/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao buscar livro',
      detalhes: error.message
    });
  }
});

/**
 * PUT /:id
 * Atualiza um livro
 * Body: { titulo?: string, isbn?: string, anoPublicacao?: number, idEditora?: number }
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

    const resultado = await atualizarLivro(parseInt(id), dados);

    if (!resultado.sucesso) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Erro PUT /livros/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao atualizar livro',
      detalhes: error.message
    });
  }
});

/**
 * DELETE /:id
 * Deleta um livro
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

    const resultado = await deletarLivro(parseInt(id));

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
    console.error('Erro DELETE /livros/:id:', error.message);
    return res.status(500).json({
      sucesso: false,
      erro: 'Erro ao deletar livro',
      detalhes: error.message
    });
  }
});

module.exports = router;
