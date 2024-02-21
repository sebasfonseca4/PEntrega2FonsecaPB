// dao/models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
