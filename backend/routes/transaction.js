const express = require('express');
const router = express.Router();
const userController =  require('../controllers/userController');

router.post('/transaction', userController.addTx);

module.exports = router;