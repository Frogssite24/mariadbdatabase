const app = require('./app');

// Porta do servidor
const PORT = process.env.PORT || 3000;

/**
 * Inicia o servidor
 */
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║     API REST - Sistema de Biblioteca      ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Servidor rodando na porta: ${PORT}                   ║
║  URL: http://localhost:${PORT}            ║
║                                           ║
║  Endpoints disponíveis:                   ║
║  ┌─ Usuários                              ║
║  │  GET    /usuarios                      ║
║  │  GET    /usuarios/:id                  ║
║  │  POST   /usuarios                      ║
║  │  PUT    /usuarios/:id                  ║
║  │  DELETE /usuarios/:id                  ║
║  │                                        ║
║  ├─ Livros                                ║
║  │  GET    /livros                        ║
║  │  GET    /livros/:id                    ║
║  │  POST   /livros                        ║
║  │  PUT    /livros/:id                    ║
║  │  DELETE /livros/:id                    ║
║  │                                        ║
║  ├─ Autores                               ║
║  │  GET    /autores                       ║
║  │  GET    /autores/:id                   ║
║  │  POST   /autores                       ║
║  │  PUT    /autores/:id                   ║
║  │  DELETE /autores/:id                   ║
║  │                                        ║
║  ├─ Editoras                              ║
║  │  GET    /editoras                      ║
║  │  GET    /editoras/:id                  ║
║  │  POST   /editoras                      ║
║  │  PUT    /editoras/:id                  ║
║  │  DELETE /editoras/:id                  ║
║  │                                        ║
║  └─ Empréstimos                           ║
║     GET    /emprestimos                   ║
║     GET    /emprestimos/:id               ║
║     POST   /emprestimos                   ║
║     PUT    /emprestimos/:id               ║
║     DELETE /emprestimos/:id               ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (err) => {
  console.error('Erro não tratado (Promise):', err);
});

process.on('uncaughtException', (err) => {
  console.error('Erro não tratado (Exception):', err);
  process.exit(1);
});
