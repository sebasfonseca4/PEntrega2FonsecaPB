// carts.router.js
const express = require("express");
const router = express.Router();
const Cart = require("../dao/models/carts.model"); 
const Product = require("../dao/models/product.model"); 

router.get("/:cid/products", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findById(cid).populate('products');
    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado." });
    }
    res.json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo productos del carrito");
  }
});

router.post("/:cid?", async (req, res) => {
  let { cid } = req.params;
  const { productId } = req.body;
  try {
    if (!cid) {
      const existingCart = await Cart.findOne({ userId: req.user._id });
      if (existingCart) {
        existingCart.products.push(productId);
        await existingCart.save();
        res.redirect('/products');
      } else {
        const newCart = new Cart({ userId: req.user._id, products: [productId], total: 0 });
        const savedCart = await newCart.save();
        console.log("Nuevo carrito creado:", savedCart);
        res.redirect('/products');
      }
    } else {
      let cart = await Cart.findById(cid);
      if (!cart) {
        return res.status(404).json({ success: false, message: "Carrito no encontrado." });
      } else {
        const existingProductIndex = cart.products.findIndex(p => p.equals(productId));
        if (existingProductIndex === -1) {
          cart.products.push(productId);
          await cart.save();
        }
      }
      res.redirect('/products');
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send("Error agregando producto al carrito");
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado." });
    }
    cart.products.pull(pid);
    await cart.save();
    res.json({ success: true, message: "Producto eliminado del carrito exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error eliminando producto del carrito");
  }
});

router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado." });
    }
    cart.products = products;
    await cart.save();
    res.json({ success: true, message: "Carrito actualizado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error actualizando carrito");
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado." });
    }
    const product = cart.products.find(p => p.equals(pid));
    if (!product) {
      return res.status(404).json({ success: false, message: "Producto no encontrado en el carrito." });
    }
    product.quantity = quantity;
    await cart.save();
    res.json({ success: true, message: "Cantidad de producto actualizada exitosamente en el carrito." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error actualizando cantidad de producto en el carrito");
  }
});

router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await Cart.findByIdAndDelete(cid);
    if (!cart) {
      return res.status(404).json({ success: false, message: "Carrito no encontrado." });
    }
    res.json({ success: true, message: "Todos los productos fueron eliminados del carrito exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error eliminando productos del carrito");
  }
});

module.exports = router;
