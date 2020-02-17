const express = require("express");
const router = express.Router();

const OrdersController = require('../controllers/order')

const checkAuth = require('../middleware/check-auth')

router.get('/', checkAuth, OrdersController.orders_get_all)

router.post('/', OrdersController.orders_post )

module.exports = router;
