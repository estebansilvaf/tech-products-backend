const { PORT, dbConfig, getDbLogSummary } = require('./config');
const logger = require('./logger');

if (!dbConfig) {
  logger.error(
    'Falta la configuración de PostgreSQL. Copia .env.example a .env y define DATABASE_URL o PGHOST, PGUSER y PGDATABASE.'
  );
  process.exit(1);
}

const app = require('./app');
const pool = require('./db/pool');
const { ensureSchema } = require('./db/ensureSchema');

function pgHint(code) {
  if (code === '28P01') {
    return 'Contraseña o usuario incorrectos (revisa PGPASSWORD / PGUSER o la contraseña dentro de DATABASE_URL).';
  }
  if (code === '3D000') {
    return 'La base de datos no existe (revisa PGDATABASE o el nombre en DATABASE_URL).';
  }
  if (code === 'ECONNREFUSED') {
    return 'No hay servidor escuchando en host:puerto (¿PostgreSQL arrancado?).';
  }
  if (code === '42P01') {
    return 'Falta la tabla u objeto en la base (ej. no se ejecutó el esquema).';
  }
  return null;
}

async function start() {
  const summary = getDbLogSummary();
  logger.info('Configuración de base de datos (sin contraseña)', summary);

  try {
    await pool.query('SELECT 1');
    logger.info('Conexión a PostgreSQL: OK (ping)');
  } catch (err) {
    logger.error('No se pudo conectar a PostgreSQL al iniciar', err);
    const hint = pgHint(err.code);
    if (hint) logger.warn('Sugerencia', hint);
    process.exit(1);
  }

  try {
    await ensureSchema(pool);
  } catch (err) {
    logger.error('No se pudo aplicar el esquema (tabla products)', err);
    const hint = pgHint(err.code);
    if (hint) logger.warn('Sugerencia', hint);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`Servidor en http://localhost:${PORT}`);
  });

  async function shutdown(signal) {
    logger.info(`${signal} recibido, cerrando...`);
    await pool.end();
    server.close(() => process.exit(0));
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start();
