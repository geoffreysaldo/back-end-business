const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/user')

router.get('/loginAddress/:address', UserController.user_login_address);

router.post('/signup', UserController.user_signup);

router.post('/verify', UserController.user_verify);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

router.get('/names', checkAuth, UserController.user_names); // get user names for a specific jwt

router.get('/users', checkAuth, UserController.users);

router.get('/informations', checkAuth, UserController.user_informations)

router.patch('/address', checkAuth, UserController.user_patch_address)

router.patch('/contact', checkAuth, UserController.user_patch_contact)


module.exports = router;
