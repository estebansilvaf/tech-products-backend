const { Pool } = require('pg');
const { dbConfig } = require('../config');
const logger = require('../logger');

const pool = new Pool(dbConfig);

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de PostgreSQL (cliente inactivo)', err);
});

module.exports = pool;
