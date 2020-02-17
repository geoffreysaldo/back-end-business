const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')

const ProductController = require('../controllers/product')

router.get('/', ProductController.products_get_all)

router.post('/', checkAuth, ProductController.products_post)

router.get('/:productId', ProductController.product_get_one)

router.patch('/:productId', checkAuth, ProductController.products_patch)

router.delete('/:productId', checkAuth, ProductController.products_delete)


module.exports = router;
