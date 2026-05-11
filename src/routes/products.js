const express = require('express');
const productService = require('../services/productService');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await productService.listProducts();
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ data: product });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
