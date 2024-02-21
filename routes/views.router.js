const express = require('express');
const router = express.Router();
const Product = require("../dao/models/product.model");
const productsRouter = require("./products.router");

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        let filter = {};
        if (query) {
          filter = { type: query }; 
        }

        let sortOptions = {};
        if (sort) {
            sortOptions = { price: sort === 'asc' ? 1 : -1 }; 
        }
        const startIndex = (page - 1) * limit;

        const products = await Product.find(filter)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(startIndex)
        .lean();

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? parseInt(page) + 1 : null;
        const prevPage = hasPrevPage ? parseInt(page) - 1 : null;
        const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo productos");
    }
});

router.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, query } = req.query;
        let filter = {};
        if (query) {
          filter = { type: query }; 
        }
        const startIndex = (page - 1) * limit;

        const products = await Product.find(filter)
            .limit(parseInt(limit))
            .skip(startIndex)
            .lean();

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? parseInt(page) + 1 : null;
        const prevPage = hasPrevPage ? parseInt(page) - 1 : null;
        const prevLink = hasPrevPage ? `/products?limit=${limit}&page=${prevPage}` : null;
        const nextLink = hasNextPage ? `/products?limit=${limit}&page=${nextPage}` : null;

        res.render('products', {
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo productos');
    }
});


router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid).lean();

        res.render('detailProduct', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo detalle del producto');
    }
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products').lean();
        
        res.render('cart', { products: cart.products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error obteniendo carrito');
    }
});

router.use("/realtimeproducts", productsRouter);

module.exports = router;
