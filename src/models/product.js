/**
 * Entidad Product (forma esperada en la API).
 * Las filas de PostgreSQL se normalizan con `fromRow`.
 *
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 */

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    stock: Number(row.stock),
  };
}

module.exports = { fromRow };
