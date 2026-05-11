const productRepository = require('../repositories/productRepository');

async function listProducts() {
  return productRepository.findAll();
}

async function getProductById(id) {
  return productRepository.findById(id);
}

module.exports = { listProducts, getProductById };
