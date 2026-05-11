-- Opcional: al arrancar la API se ejecuta el mismo esquema (src/db/ensureSchema.js).
-- También puedes aplicarlo manualmente, por ejemplo:
-- psql -U postgres -d tech_products -f sql/schema.sql

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0
);

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
