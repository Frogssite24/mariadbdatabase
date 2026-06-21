const express = require('express');

// Importar as rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const livroRoutes = require('./src/routes/livroRoutes');
const autorRoutes = require('./src/routes/autorRoutes');
const editoraRoutes = require('./src/routes/editoraRoutes');
const emprestimoRoutes = require('./src/routes/emprestimoRoutes');

// Criar aplicação Express
const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Rotas da API
 */
app.use('/usuarios', usuarioRoutes);
app.use('/livros', livroRoutes);
app.use('/autores', autorRoutes);
app.use('/editoras', editoraRoutes);
app.use('/emprestimos', emprestimoRoutes);

/**
 * Rota raiz - Health check
 */
app.get('/', (req, res) => {
  return res.status(200).json({
    sucesso: true,
    mensagem: 'API de Biblioteca está funcionando',
    versao: '1.0.0',
    endpoints: {
      usuarios: '/usuarios',
      livros: '/livros',
      autores: '/autores',
      editoras: '/editoras',
      emprestimos: '/emprestimos'
    }
  });
});

/**
 * Tratamento de rotas não encontradas (404)
 */
app.use((req, res) => {
  return res.status(404).json({
    sucesso: false,
    erro: 'Rota não encontrada',
    endpoint: req.originalUrl,
    metodo: req.method
  });
});

/**
 * Tratamento global de erros
 */
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.message);
  return res.status(500).json({
    sucesso: false,
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
