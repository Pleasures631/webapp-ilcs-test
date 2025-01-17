const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/vehicle', userController.getVehicle);
router.post('/transaction', userController.addTx);

router.get('/', (req, res) => {
    
});

module.exports = router;
