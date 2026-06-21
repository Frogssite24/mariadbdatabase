-- Script de alteração da tabela Emprestimo para usar o modelo Usuario
-- Deve ser executado após a criação da tabela Usuario.

ALTER TABLE Emprestimo
  ADD COLUMN IF NOT EXISTS idUsuario INT NULL AFTER idLivro;

ALTER TABLE Emprestimo
  ADD CONSTRAINT FK_Emprestimo_Usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario);

-- Se não houver dados antigos ou se todos os empréstimos já estiverem migrados,
-- remova a coluna nomeLeitor.
ALTER TABLE Emprestimo
  DROP COLUMN IF EXISTS nomeLeitor;
