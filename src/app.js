const express = require('express');
const productsRouter = require('./routes/products');
const logger = require('./logger');

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

app.use(express.json());

app.use((req, res, next) => {
  const started = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - started;
    logger.info(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/', (req, res) => {
  res.json({ mensaje: 'API OK', products: '/api/products' });
});

app.use('/api/products', productsRouter);

app.use((err, req, res, next) => {
  const payload = {
    error: 'Internal server error',
    message: err.message,
    ...(err.code && { pgCode: err.code }),
  };
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, err);
  if (isDev) {
    return res.status(500).json(payload);
  }
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
