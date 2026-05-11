const pool = require('../db/pool');
const { fromRow } = require('../models/product');

async function findAll() {
  const { rows } = await pool.query(
    `SELECT id, name, price, stock FROM products ORDER BY id ASC`
  );
  return rows.map(fromRow);
}

async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id, name, price, stock FROM products WHERE id = $1`,
    [id]
  );
  const row = rows[0];
  return row ? fromRow(row) : null;
}

module.exports = { findAll, findById };
