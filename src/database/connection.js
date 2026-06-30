const mysql = require('mysql2/promise');

// Configuração da conexão com MariaDB
const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'heitor',
  password: process.env.DB_PSWD || 'Senha123forte!',
  database: process.env.DB_DATABASE || 'biblioteca'
};

let connection = null;

/**
 * Cria e retorna uma conexão com o banco de dados MariaDB
 * @returns {Promise<Connection>} Conexão com o banco de dados
 */
async function getConnection() {
  try {
    if (!connection || connection.connection.destroyed) {
      connection = await mysql.createConnection(connectionConfig);
      console.log('✓ Conexão estabelecida com sucesso ao MariaDB');
    }
    return connection;
  } catch (error) {
    console.error('✗ Erro ao conectar ao MariaDB:', error.message);
    throw error;
  }
}

/**
 * Fecha a conexão com o banco de dados
 * @returns {Promise<void>}
 */
async function closeConnection() {
  try {
    if (connection) {
      await connection.end();
      connection = null;
      console.log('✓ Conexão fechada com sucesso');
    }
  } catch (error) {
    console.error('✗ Erro ao fechar conexão:', error.message);
    throw error;
  }
}

/**
 * Executa uma query no banco de dados
 * @param {string} query - Query SQL a ser executada
 * @param {array} params - Parâmetros para a query (opcional)
 * @returns {Promise<array>} Resultado da query
 */
async function executeQuery(query, params = []) {
  try {
    const conn = await getConnection();
    const [results] = await conn.execute(query, params);
    return results;
  } catch (error) {
    console.error('✗ Erro ao executar query:', error.message);
    throw error;
  }
}

/**
 * Testa a conexão com o banco de dados
 * @returns {Promise<boolean>} True se conectado com sucesso
 */
async function testConnection() {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT 1');
    console.log('✓ Teste de conexão bem-sucedido');
    return true;
  } catch (error) {
    console.error('✗ Falha no teste de conexão:', error.message);
    return false;
  }
}

module.exports = {
  getConnection,
  closeConnection,
  executeQuery,
  testConnection,
  connectionConfig
};
