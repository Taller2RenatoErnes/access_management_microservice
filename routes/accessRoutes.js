const express = require('express');
const router = express.Router();


const { login,
    register,
    updatePassword
 } = require('../controllers/tokensController');




router.post('/login', login);

router.post('/register', register);

router.put('/updatePassword', updatePassword);

module.exports = router;