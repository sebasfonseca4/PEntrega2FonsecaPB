const express = require("express");
const router = express.Router();
const Product = require("../dao/models/product.model");


router.get("/", async (req, res) => {
  try {
    const products = await Product.find().lean();
    res.render("realTimeProducts", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo productos");
  }
});

router.post("/addProduct", async (req, res) => {
  let product = req.body;
  try {
    const newProduct = new Product({
      name: product.productName,
      price: parseFloat(product.productPrice),
    });
    await newProduct.save();
    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error agregando producto");
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Producto no encontrado." });
    }
    res.json({ success: true, message: "Producto eliminado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error eliminando producto");
  }
});

module.exports = router;
