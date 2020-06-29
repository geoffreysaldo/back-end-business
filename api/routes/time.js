const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const checkAuthAdmin = require('../middleware/check-auth-admin')

const timeController = require('../controllers/time')

router.get('/', checkAuthAdmin, timeController.time_get_all)

router.get('/:today/:tomorrow', timeController.time_get_today_tomorrow)

router.post('/', checkAuthAdmin, timeController.time_post)

router.patch('/', checkAuthAdmin, timeController.time_update) 

router.patch('/disable', checkAuthAdmin, timeController.time_update_disable)

router.delete('/:day', checkAuthAdmin, timeController.time_delete)




module.exports = router;