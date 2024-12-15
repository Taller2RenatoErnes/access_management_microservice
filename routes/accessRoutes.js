const express = require('express');
const router = express.Router();
const { login, getId } = require('../controllers/authController');
const { validateJWT} = require('../middleware/jwt');
const { ro } = require('@faker-js/faker');

router.post('/login', login);

router.post('/validate', validateJWT);

router.post('/getId', getId);



module.exports = router;