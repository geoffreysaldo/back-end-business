const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user')

router.get('/loginAddress/:address', UserController.user_login_address);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

router.get('/names', checkAuth, UserController.user_names);

module.exports = router;
