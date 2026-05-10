const express = require('express');
const { products } = require('../data/products');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ data: products });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Products not found' });
  }
  res.json({ data: product });
});

module.exports = router;
