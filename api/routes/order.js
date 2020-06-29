const express = require("express");
const router = express.Router();

const OrdersController = require('../controllers/order')

const checkAuth = require('../middleware/check-auth')
const checkAuthAdmin = require('../middleware/check-auth-admin')
const checkUserOrAdmin = require('../middleware/check-user-or-admin')

router.get('/', checkAuthAdmin, OrdersController.orders_get_all)

router.get('/date/:date',checkAuthAdmin, OrdersController.orders_get_by_date)

router.get('/month/:month/:interval', checkAuthAdmin, OrdersController.orders_get_by_month)

router.get('/:userId/:interval', checkUserOrAdmin, OrdersController.orders_get_by_id)

router.get('/historique', checkAuthAdmin, OrdersController.orders_get_historique)

router.post('/', OrdersController.orders_post )

router.delete('/:orderId', checkAuthAdmin, OrdersController.orders_delete)

router.patch('/', checkAuthAdmin, OrdersController.order_patch_chosenTime)

router.patch('/state', checkAuthAdmin, OrdersController.order_patch_state)


module.exports = router;
