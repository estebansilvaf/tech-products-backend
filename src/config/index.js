const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const PORT = Number(process.env.PORT) || 3000;

function buildDbConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  if (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE) {
    return {
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD ?? '',
      database: process.env.PGDATABASE,
    };
  }
  return null;
}

const dbConfig = buildDbConfig();

/** Resumen seguro para logs (sin contraseña). */
function getDbLogSummary() {
  if (!dbConfig) return null;
  if (dbConfig.connectionString) {
    try {
      const u = new URL(dbConfig.connectionString);
      return {
        via: 'DATABASE_URL',
        host: u.hostname,
        port: u.port || '5432',
        database: (u.pathname || '').replace(/^\//, '') || '(sin nombre)',
        user: decodeURIComponent(u.username || ''),
      };
    } catch {
      return { via: 'DATABASE_URL', note: 'URL inválida o no reconocida' };
    }
  }
  return {
    via: 'variables PG*',
    host: dbConfig.host,
    port: String(dbConfig.port),
    database: dbConfig.database,
    user: dbConfig.user,
  };
}

module.exports = { PORT, dbConfig, getDbLogSummary };
