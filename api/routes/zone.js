const express = require('express');
const router = express.Router();

const checkAuthAdmin = require('../middleware/check-auth-admin');
const zoneController = require('../controllers/zone')

router.get('/', zoneController.get_zones)

router.post('/', checkAuthAdmin ,zoneController.post_zone)

router.patch('/', checkAuthAdmin ,zoneController.update_zone)

router.delete('/', checkAuthAdmin ,zoneController.delete_zone)

module.exports = router;