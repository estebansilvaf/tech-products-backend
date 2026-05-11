const logger = require('../logger');

const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);
`;

/** Mismo contenido que sql/schema.sql — solo se inserta si la tabla está vacía. */
const SEED_SQL = `
INSERT INTO products (name, price, stock) VALUES
  ('Auriculares', 49.99, 12),
  ('Teclado mecánico', 89.50, 5),
  ('Mouse inalámbrico', 24.00, 30),
  ('Monitor 27"', 219.99, 8),
  ('Silla gamer ergonómica', 159.90, 7),
  ('Webcam Full HD', 39.90, 18),
  ('Micrófono USB', 54.75, 11),
  ('Mousepad XL', 12.50, 40),
  ('Disco SSD 1TB', 109.99, 9),
  ('Memoria RAM 16GB', 44.99, 22),
  ('Router Wi‑Fi 6', 79.99, 6),
  ('Parlantes 2.1', 34.90, 13),
  ('Hub USB‑C 7 en 1', 29.90, 15),
  ('Cargador GaN 65W', 25.00, 20),
  ('Teclado numérico USB', 14.99, 17),
  ('Soporte para portátil', 18.50, 26),
  ('Cable HDMI 2.1', 9.99, 35),
  ('Audífonos Bluetooth', 59.90, 10);
`;

/**
 * Garantiza que exista la tabla y, si está vacía, carga los datos iniciales.
 */
async function ensureSchema(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(CREATE_TABLE);
    const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM products');
    const n = rows[0].n;
    if (n === 0) {
      await client.query(SEED_SQL);
      logger.info(`Esquema: tabla products lista; se insertaron filas iniciales.`);
    } else {
      logger.info(`Esquema: tabla products OK (${n} filas; no se re-seedea).`);
    }
    await client.query('COMMIT');
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      /* ignore */
    }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { ensureSchema };
